# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

puts "destroying all records"
Box.destroy_all
OrderItem.destroy_all
Item.destroy_all
Order.destroy_all
User.destroy_all
puts "everything destroyed"

puts "creating user --- email: 'test@test.com', password: 'password'"

User.create(email: 'test@test.com', password: 'password')

puts "creating boxes"

Box.create(width: 135, depth: 240, height: 20, name: 'Envelope', weight_limit: 4000)
Box.create(width: 370, depth: 295, height: 50, name: 'Pak 1', weight_limit: 4000)
Box.create(width: 390, depth: 305, height: 20, name: 'Pak 2', weight_limit: 4000)
Box.create(width: 445, depth: 525, height: 50, name: 'Pak 3', weight_limit: 4000)
Box.create(width: 320, depth: 260, height: 20, name: 'Pak 4', weight_limit: 4000)
Box.create(width: 150, depth: 150, height: 965, name: 'Tube', weight_limit: 4000)
Box.create(width: 400, depth: 330, height: 250, name: '10kg box', weight_limit: 10000)
Box.create(width: 550, depth: 420, height: 330, name: '25kg box', weight_limit: 25000)
Box.create(width: 310, depth: 270, height: 30, name: 'Small box 1', weight_limit: 4000)
Box.create(width: 280, depth: 220, height: 100, name: 'Small box 2', weight_limit: 4000)
Box.create(width: 330, depth: 290, height: 50, name: 'Medium box 1', weight_limit: 4000)
Box.create(width: 280, depth: 220, height: 100, name: 'Medium box 2', weight_limit: 4000)
Box.create(width: 440, depth: 310, height: 75, name: 'Large box 1', weight_limit: 4000)
Box.create(width: 280, depth: 220, height: 190, name: 'Large box 2', weight_limit: 4000)
Box.create(width: 290, depth: 270, height: 280, name: 'Extra large box 1', weight_limit: 4000)
Box.create(width: 390, depth: 350, height: 700, name: 'Extra large box 2', weight_limit: 4000)

puts "creating items"

book = Item.create(name: 'Book', width: 148, depth: 210, height: 25, fragile: false, padding: 0, weight: 200)
wine_glass = Item.create(name: 'Wine glass', width: 80, depth: 230, height: 80, fragile: true, padding: 0, weight: 200)
board_game = Item.create(name: 'Board game', width: 300, depth: 300, height: 100, fragile: false, padding: 0, weight: 200)
picture_frame = Item.create(name: 'Picture frame', width: 100, depth: 250, height: 15, fragile: true, padding: 0, weight: 200)
candle = Item.create(name: 'Candle', width: 20, depth: 150, height: 20, fragile: false, padding: 0, weight: 200)
t_shirt = Item.create(name: 't-shirt', width: 30, depth: 70, height: 20, fragile: false, padding: 0, weight: 200)
paint_can = Item.create(name: 'paint can', width: 150, depth: 120, height: 150, fragile: false, padding: 0, weight: 5000)

puts "creating orders"

order1 = Order.create(name: '#APR1030510579', note: 'Customer called in to ask for order to be gift wrapped.')
order2 = Order.create(name: '#ATR1329508606', note: 'Leave parcel in garage')
order3 = Order.create(name: '#APR1094869139')
order4 = Order.create(name: '#AQQ1948012035')
order5 = Order.create(name: '#ATS1290385018')

puts "creating order items"

OrderItem.create(item: book, order: order1)
OrderItem.create(item: wine_glass, order: order1)

OrderItem.create(item: book, order: order2)
OrderItem.create(item: wine_glass, order: order2)
OrderItem.create(item: picture_frame, order: order2)

OrderItem.create(item: board_game, order: order3)
OrderItem.create(item: t_shirt, order: order3)

OrderItem.create(item: book, order: order4)
OrderItem.create(item: picture_frame, order: order4)
OrderItem.create(item: candle, order: order4)
OrderItem.create(item: candle, order: order4)
OrderItem.create(item: t_shirt, order: order4)
OrderItem.create(item: book, order: order4)
OrderItem.create(item: picture_frame, order: order4)
OrderItem.create(item: candle, order: order4)
OrderItem.create(item: candle, order: order4)
OrderItem.create(item: t_shirt, order: order4)
OrderItem.create(item: book, order: order4)
OrderItem.create(item: picture_frame, order: order4)
OrderItem.create(item: candle, order: order4)
OrderItem.create(item: candle, order: order4)
OrderItem.create(item: t_shirt, order: order4)

OrderItem.create(item: paint_can, order: order5)
