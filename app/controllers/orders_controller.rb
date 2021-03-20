class OrdersController < ApplicationController
  before_action :set_order, only: [:show, :update]

  def index
  end

  def show
  end

  def update
    @order.update(packed: true)
    redirect_to orders_path
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end
end
