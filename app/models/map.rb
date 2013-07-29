class Map < ActiveRecord::Base
  belongs_to :user
  has_many :tags

  before_save   :make_shorty

  def make_shorty
    url = SecureRandom.hex(3)
    
    if Map.find_by_url(url) != nil
      make_shorty
    end
    self.url = url
  end
end
