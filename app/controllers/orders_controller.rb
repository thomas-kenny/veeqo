require 'net/http'
require 'json'

class OrdersController < ApplicationController

  def index
  end

  def show
    @order = Order.find(params[:id])
    boxes_hash = get_packing_data(Box.all, @order.items)
  end

  private

  def get_packing_data(packing_containers, items)
    uri = URI.parse("http://www.packit4me.com/api/call/raw")
    http = Net::HTTP.new(uri.host, uri.port)
    response = http.post(uri.path, "#{ boxes_to_url_text(packing_containers) }&#{ items_to_url_text(items) }")

    json_data = response.body
    parsed_json = JSON.parse(json_data)

    boxes_with_items = parsed_json.select { |box| box["item_count"] > 0 }
    box_hash = {}

    boxes_with_items.each do |box|
      items = []
      box["items"].each { |item| items << Item.find(item["id"]) }

      box_name = Box.find(box["id"]).name
      box_weight = box["curr_weight"]
      fragile = items.any? { |item| item.fragile }

      new_hash = { name: box_name, current_weight: box_weight, contains_fragile: fragile, items: items }

      if box_hash[:boxes]
        box_hash[:boxes] << new_hash
      else
        box_hash[:boxes] = [new_hash]
      end
    end

    box_hash
  end
  

  def boxes_to_url_text(boxes)
    #bins=0:50:5x5x5,1:50:5x5x5
    box_strings = boxes.map { |box|  "#{ box.id }:#{ box.weight_limit / 1000.0 }:#{ box.width / 10.0 }x#{ box.height / 10.0 }x#{ box.depth / 10.0 }" }
    "bins=" << box_strings.join(",")
  end

  def items_to_url_text(items)
    #items=0:0:15:1x1x1,1:0:15:1x1x1
    item_strings = items.map { |item|  "#{ item.id }:0:#{ item.weight / 1000.0 }:#{ item.width / 10.0 }x#{ item.height / 10.0 }x#{ item.depth / 10.0 }" }
    "items=" << item_strings.join(",")
  end
end
