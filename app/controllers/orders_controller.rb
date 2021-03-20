require 'net/http'

class OrdersController < ApplicationController

  def index
  end

  def show
    @order = Order.find(params[:id])
    get_packing_data(Boxes.all, @order.items)
  end

  private

  def get_packing_data(packing_containers, items)
    # uri = URI.parse("http://www.packit4me.com/api/call/raw")
    # http = Net::HTTP.new(uri.host, uri.port)
    # response = http.post(uri.path, "#{ boxes_to_url_text(packing_containers) }&#{ items_to_url_text(items) }")
    # puts response.body
     "#{ boxes_to_url_text(packing_containers) }&#{ items_to_url_text(items) }"    
  end
  

  def boxes_to_url_text(boxes)
    #bins=0:50:5x5x5,1:50:5x5x5
    boxes.map! { |box|  "#{ box.id }:#{ box.weight_limit / 1000.0 }:#{ box.width / 10.0 }x#{ box.height / 10.0 }x#{ box.depth / 10.0 }" }
    "bins=" << boxes.join(",")
  end

  def items_to_url_text(items)
    #items=0:0:15:1x1x1,1:0:15:1x1x1
    items.map! { |item|  "#{ item.id }:0:#{ item.weight / 1000.0 }:#{ item.width / 10.0 }x#{ item.height / 10.0 }x#{ item.depth / 10.0 }" }
    "items=" << items.join(",")
  end
end
