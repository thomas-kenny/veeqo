class AddWeightLimitToBoxes < ActiveRecord::Migration[6.0]
  def change
    add_column :boxes, :weight_limit, :integer
  end
end
