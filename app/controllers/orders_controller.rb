require 'net/http'
require 'json'

class OrdersController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :set_order, only: [:show, :update]

  def index
    @complete_orders = Order.where(packed: true)
    @incomplete_orders = Order.where(packed: false)
  end

  def show
    response = get_packing_data(Box.all, @order.items)
    @box_json = response[:json]
    @boxes_hash = response[:view_hash]
  end

  def update
    @order.update(packed: true)
    redirect_to orders_path
  end

  private

  def get_packing_data(packing_containers, items)
    # we want to get a json for the 3d and an array of instances for the view
    parsed_json = get_api_parsed_json(packing_containers, items)
    boxes_with_items = parsed_json.select { |box| (box["item_count"]).positive? }

    box_hash = {}

    boxes_with_items.each do |box|
      # get updated json with the item names as well as an array of item instances
      items_data = get_box_items(box["items"])
      box["items"] = items_data[:json]
      item_instances = items_data[:instances]

      # get box name and save it to the new hash as well as to the json for the 3d view
      box_name = Box.find(box["id"]).name
      box[:name] = box_name

      # new hash prep
      box_weight = box["curr_weight"]
      fragile = items.any?(&:fragile)

      # creating a new hash for the view
      new_hash = { id: box["id"], name: box_name, current_weight: box_weight,
                   contains_fragile: fragile, items: item_instances }

      # push box hash to the hash
      if box_hash[:boxes]
        box_hash[:boxes] << new_hash
      else
        box_hash[:boxes] = [new_hash]
      end
    end

    { view_hash: box_hash, json: boxes_with_items }
  end

  def get_box_items(items_json)
    # use the hash of box items which contains an id, make a new array of the instances,
    item_instances = []

    items_json.each do |box_item|
      item_instance = Item.find(box_item["id"])
      # but also add a box name to the json as we also reuse this data for the 3d
      box_item["name"] = item_instance.name
      item_instances << item_instance
    end

    { instances: item_instances, json: items_json }
  end

  def get_api_parsed_json(packing_containers, items)
    uri = URI.parse("http://www.packit4me.com/api/call/raw")
    http = Net::HTTP.new(uri.host, uri.port)
    response = http.post(uri.path, "#{boxes_to_url_text(packing_containers)}&#{items_to_url_text(items)}")

    json_data = response.body
    JSON.parse(json_data)
  end

  def boxes_to_url_text(boxes)
    # API format: bins=0:50:5x5x5,1:50:5x5x5
    box_strings = boxes.map do |box|
      "#{box.id}:#{box.weight_limit / 1000.0}:#{box.width / 10.0}x#{box.height / 10.0}x#{box.depth / 10.0}"
    end
    "bins=" << box_strings.join(",")
  end

  def items_to_url_text(items)
    # API format: items=0:0:15:1x1x1,1:0:15:1x1x1
    # we want the data to be in grams and cms for the user, so we must convert

    items_as_string = items.map do |item|
      if item.fragile
        # how much padding you want on fragile items * 2 (effects both sides of the plane)
        padding_in_cm = 0 * 2

        width = (item.width / 10.0) + padding_in_cm
        height = (item.height / 10.0) + padding_in_cm
        depth = (item.depth / 10.0) + padding_in_cm
      else
        width = (item.width / 10.0)
        height = (item.height / 10.0)
        depth = (item.depth / 10.0)
      end

      "#{item.id}:0:#{item.weight / 1000.0}:#{width}x#{height}x#{depth}"
    end
    "items=" << items_as_string.join(",")
  end

  def set_order
    @order = Order.find(params[:id])
  end
end
