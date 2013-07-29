class CreateTags < ActiveRecord::Migration
  def change
  	create_table :tags do |t|
  	  t.string :longitude
  	  t.string :latitude
  	  t.string :place
  	  t.text   :description
  	  t.string :select
      t.references :map
      t.references :user
      t.string :user_fb_id
      t.string :user_name

  	  t.timestamps
    end   

    add_index :tags, :map_id
    add_index :tags, :user_id
  end
end
