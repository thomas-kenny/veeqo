class AddNotesToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :note, :text
  end
end
