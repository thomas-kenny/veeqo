class CreateBoxes < ActiveRecord::Migration[6.0]
  def change
    create_table :boxes do |t|
      t.string :name
      t.integer :width
      t.integer :height
      t.integer :depth

      t.timestamps
    end
  end
end
