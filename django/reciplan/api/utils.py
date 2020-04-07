# A place to write helper functions and SQL queries to aid functions such as:
#   finding a recipe, adding a recipe to the database, adding a recipe to cart
import json
from django.db import models
from django.db import connection
from .models import *
import datetime

def find_recipes(query):
    # returns a list of recipes that match the query
    # runs a SQL query against our DB to find the closest matches (will this be mongo instead?)
    # input: query is a lower-case string
    return [{'recipeName':'pasta'}, {'recipeName':'rice'}] # Mocked the data for now

def get_recipe_data(recipeID):
    # returns recipeAuthor, recipeTitle, recipeIngredients, recipeInstructions, recipePictureURL
    # input: recipeID
    # Write SQL/MongoDB query here to find the recipe data
    return '', '', '', '', ''

def add_recipe(recipeOwner, recipeTitle, recipeIngredients, recipeInstructions, recipePictureURL):
    # Adds a new recipe to MongoDB
    # return True if successful, false if unsuccessful
    return True

def get_cart_data(userID):
    # Returns cartItems (list of recipeNames), cartDateUpdated for logged-in user userID
    userID = 1
    data = Carts.objects.raw('SELECT * FROM api_carts WHERE userID=%s LIMIT 1', [userID])
    returnRecipes = []
    date = ''
    for cart in data:
        returnRecipes = cart.recipeIDs.split("/")
        date = str(cart.dateUpdated)
    print(returnRecipes)
    print(date)
    return returnRecipes, date

def delete_from_cart(recipeID):
    # Remove given recipeID from Cart Table
    # return True if successful, false if unsuccessful
    date = str(datetime.datetime.now())
    with connection.cursor() as cursor:
        cursor.execute("UPDATE api_carts SET recipeIDs = REPLACE(recipeIDs, %s, ''), dateUpdated = %s", [recipeID,date])
    return True

def authenticate_user(username, password):
    # check if username password combination exists
    username = 1
    password = 'testpassword'
    parameters = [username,password]
    data = Users.objects.raw('SELECT * FROM api_users WHERE userID=%s AND password=%s', parameters)
    print(type(data))
    for r in data:
        print(r.name)
        return True
    # return true or false accordingly
    return False

def add_user(username, password, name, bio, location, pictureURL):
    # add a new user to User table
    count = Users.objects.count()+1
    print(count)
    parameters = [count, name, bio, location, pictureURL, password]
    data = Users.objects.raw('SELECT * FROM api_users WHERE userID=%s', [count])
    for user in data:
        return False
    with connection.cursor() as cursor:
        cursor.execute('INSERT INTO api_users (userID, name, bio, location, pictureURL, password) VALUES (%s,%s,%s,%s,%s,%s)', parameters)
    return True

def get_user_metadata(loggedInUser):
    # returns name, bio, location, pictureURL, listOfRecipeNames of the loggedInUser
    # for now returns recipe ids because mongo has not been started yet
    users = Users.objects.raw('SELECT * FROM api_users WHERE userID=%s LIMIT 1', [loggedInUser])
    recipes = OwnsRecipes.objects.raw('SELECT * FROM api_ownsrecipes WHERE userID=%s', [loggedInUser])
    for user in users:
        recipeList = ''
        for recipe in recipes:
            recipeList += recipe.recipeID
        print(user.name, user.bio)
        return user.name, user.bio, user.location, user.pictureURL, recipeList
    print("user not found")
    return 'not found', 'not found', 'not found', 'not found', 'not found'