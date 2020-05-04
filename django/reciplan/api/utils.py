# A place to write helper functions and SQL queries to aid functions such as:
#   finding a recipe, adding a recipe to the database, adding a recipe to cart
import json
from django.db import models
from django.db import connection
from .models import *
import datetime
import sqlite3

def find_recipes(query):
    # returns a list of recipes that match the query
    # runs a SQL query against our DB to find the closest matches
    # input: query is a lower-case string
    query = "%" + query + "%"
    data = Recipes.objects.raw('SELECT * FROM api_recipes WHERE title LIKE %s', [query])
    #data = Recipes.objects.raw('SELECT * FROM api_recipes LIMIT 10;')
    #data = Recipes.objects.raw('SELECT * FROM api_recipes WHERE CONTAINS(title, "apple");')
    recipeNames = []
    for recipe in data:
        recipeNames.append({'recipeName':recipe.title})
    print(str(recipeNames))
    return recipeNames

def get_recipe_data(recipeID):
    # returns recipeAuthor, recipeTitle, recipeIngredients, recipeInstructions, recipePictureURL
    # input: recipeID
    # Write SQL query here to find the recipe data
    data = Recipes.objects.raw('SELECT * FROM api_recipes WHERE recipeID=%s', [recipeID])
    recipeTitle = data[0].title
    recipeIngredients = data[0].ingredients
    recipeInstructions = data[0].instructions
    recipePictureURL = data[0].picture_link
    data = OwnsRecipes.objects.raw('SELECT * FROM api_ownsrecipes WHERE recipeID=%s', [recipeID])
    recipeAuthor = data[0].userID
    return recipeAuthor, recipeTitle, recipeIngredients, recipeInstructions, recipePictureURL

def add_recipe(recipeOwner, recipeTitle, recipeIngredients, recipeInstructions, recipePictureURL):
    # Adds a new recipe to SQL database
    # return True if successful, False if unsuccessful
    # generate new recipe id
    newrecid = str(recipeOwner) + recipeTitle + recipePictureURL + recipeIngredients + recipeInstructions
    newrecid = newrecid.replace(" ", "")
    with connection.cursor() as cursor:
        cursor.execute('INSERT INTO api_recipes (recipeID, title, ingredients, instructions, pictureLink) VALUES (%s,%s,%s,%s,%s)', [newrecid,recipeTitle,recipeIngredients,recipeInstructions,recipePictureURL])
    with connection.cursor() as cursor:
        cursor.execute('INSERT INTO api_ownsrecipes (userID, recipeID) VALUES (%s,%s)', [recipeOwner,newrecid])
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
    parameters = [username,password]
    data = Users.objects.raw('SELECT * FROM api_users WHERE userID=%s AND password=%s', parameters)
    for r in data:
        obj = {
            'username': r.userID,
            'name': r.name,
            'password': r.password,
            'location': r.location,
            'bio': r.bio,
            'pictureURL': r.pictureURL
        }
        return obj
    # return true or false accordingly
    print("did not return user")
    return None

def add_user(username, password, name, bio, location, pictureURL):
    # add a new user to User table
    parameters = [username, name, bio, location, pictureURL, password]
    data = Users.objects.raw('SELECT * FROM api_users WHERE userID=%s', [username])
    for user in data:
        return False
    with connection.cursor() as cursor:
        cursor.execute('INSERT INTO api_users (userID, name, bio, location, pictureURL, password) VALUES (%s,%s,%s,%s,%s,%s)', parameters)
    return True

def delete_user(username):
    # data = Users.objects.raw('SELECT * FROM api_users WHERE userID=%s', [username])
    # for user in data:
    response = Users.objects.raw('DELETE FROM api_users WHERE userID=%s', [username])
    return True
    # return False

def update_user(username, password, name, bio, location, pictureURL):
    parameters = [name, bio, location, pictureURL, password, username]
    data = Users.objects.raw('SELECT * FROM api_users WHERE userID=%s', [username])
    for user in data:
        with connection.cursor() as cursor:
            cursor.execute('UPDATE api_users SET name=%s, bio=%s, location=%s, pictureURL=%s, password=%s WHERE userID=%s', parameters)
        return True
    return False

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

def get_user_recipes(username):
    username = int(username)
    print(username)
    #connection = sqlite3.connect('db.sqlite3')

    #queryResults = c.execute('SELECT recipeID, title FROM (SELECT recipeID FROM api_ownsrecipes WHERE userID=%s) AS ownedRecipes NATURAL JOIN api_recipes', [username])
    #with connection.cursor() as cursor:
    #    cursor.execute('SELECT recipeID FROM api_ownsrecipes WHERE userID="1"')
    connection = sqlite3.connect('db.sqlite3')
    cursor = connection.cursor()
    #queryResults = cursor.execute('SELECT * FROM api_users LIMIT 1')
    #queryResults = cursor.execute('SELECT recipeID, title FROM (SELECT recipeID FROM api_ownsrecipes WHERE userID=%s) AS ownedRecipes NATURAL JOIN api_recipes', [username])
    toReturn = []
    queryResults = OwnsRecipes.objects.raw('SELECT userID, recipeID FROM api_ownsrecipes WHERE userID=%s',[username])
    recipeList = []
    for row in queryResults:
        recipeList.append(row.recipeID)
    for i in range(len(recipeList)):
        singleResult = Recipes.objects.raw('SELECT recipeID, title FROM api_recipes WHERE recipeID=%s',[recipeList[i]])
        for res in singleResult:
            toReturn.append({'name': res.title, 'recipe_id': res.recipeID})
    #for row in queryResults:
        #print(str(row))
        #toReturn.append({'name': row[1], 'recipe_id': row[0]})
    return toReturn

def delete_recipe(recipeID):
    # Remove given recipeID from Cart Table
    # return True if successful, false if unsuccessful
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM api_recipes WHERE recipeID = %s", [recipeID])
    return True

def af1():
    # Returns a dictionary of key: name of user, value: number of times this user's recipes have been favorited
    # A leaderboard
    conn = sqlite3.connect('db.sqlite3')
    c = conn.cursor()

    queryResults = c.execute("""Select name, COUNT(name)
            FROM api_userfavorites, (SELECT name, recipeID
            FROM api_ownsrecipes NATURAL JOIN api_users) AS ownerName
            WHERE ownerName.recipeID = api_userfavorites.recipeID
            GROUP BY name
            ORDER BY COUNT(name) DESC""").fetchmany(10)

    leaderboard = dict()
    for row in queryResults:
        leaderboard[row[0]] = row[1]

    #conn.close()
    return leaderboard
