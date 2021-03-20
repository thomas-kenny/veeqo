class CreateOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :orders do |t|
      t.boolean :packed, default: false

      t.timestamps
    end
  end
end
