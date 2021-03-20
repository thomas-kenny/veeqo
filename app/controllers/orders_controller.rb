class OrdersController < ApplicationController
  def index
  end

  def show
  end

  def update
    @order = Order.find(params[:id])
    @order.update(packed: true)
    redirect_to orders_path
  end
end
