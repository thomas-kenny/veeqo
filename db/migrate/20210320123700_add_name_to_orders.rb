class AddNameToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :name, :string
  end
end
