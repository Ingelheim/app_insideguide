class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.string :longitude
      t.string :latitude
      t.string :city
      t.string :url
      t.integer :user_id

      t.timestamps
    end   

    add_index :maps, :user_id
  end
end

