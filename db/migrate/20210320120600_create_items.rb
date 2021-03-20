class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string :name
      t.boolean :fragile, default: false
      t.integer :padding
      t.integer :weight
      t.integer :width
      t.integer :height
      t.integer :depth

      t.timestamps
    end
  end
end
