# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create(email: "test@test.com", password: 'password')

Box.create(width: 135, depth: 240, height: 20, name: 'Envelope')
Box.create(width: 370, depth: 295, height: 50, name: 'Pak 1')
Box.create(width: 390, depth: 305, height: 20, name: 'Pak 2')
Box.create(width: 445, depth: 525, height: 50, name: 'Pak 3')
Box.create(width: 320, depth: 260, height: 20, name: 'Pak 4')
Box.create(width: 150, depth: 150, height: 965, name: 'Tube')
Box.create(width: 400, depth: 330, height: 250, name: '10kg box')
Box.create(width: 550, depth: 420, height: 330, name: '25kg box')
Box.create(width: 310, depth: 270, height: 30, name: 'Small box 1')
Box.create(width: 280, depth: 220, height: 100, name: 'Small box 2')
Box.create(width: 330, depth: 290, height: 50, name: 'Medium box 1')
Box.create(width: 280, depth: 220, height: 100, name: 'Medium box 2')
Box.create(width: 440, depth: 310, height: 75, name: 'Large box 1')
Box.create(width: 280, depth: 220, height: 190, name: 'Large box 2')
Box.create(width: 290, depth: 270, height: 280, name: 'Extra large box 1')
Box.create(width: 390, depth: 350, height: 700, name: 'Extra large box 2')

Item.create(name: 'Book', width: 148, depth: 210, height: 25, fragile: false, padding: 0, weight: 0)
Item.create(name: 'Wine glass', width: 80, depth: 230, height: 80, fragile: true, padding: 0, weight: 0)
Item.create(name: 'Book', width: 148, depth: 210, height: 25, fragile: false, padding: 0, weight: 0)
Item.create(name: 'Book', width: 148, depth: 210, height: 25, fragile: false, padding: 0, weight: 0)
Item.create(name: 'Book', width: 148, depth: 210, height: 25, fragile: false, padding: 0, weight: 0)
Item.create(name: 'Book', width: 148, depth: 210, height: 25, fragile: false, padding: 0, weight: 0)
