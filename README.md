# Ironhack-Endwalker

# Outcomes

Our proposed outcome for this project is to create an application whereby players of Final Fantasy 14 can interact with one another. They will have a user profile, which displays information about their account and other details. They can look up items and armour, which they can add to a 'favourites' list. These items and armour can be commented on, so players can add that they are looking for an item or piece of armour; other players can then reply saying that they know the location of the item or can help find them.

# MODELS

## User

name:String;
email:String;
passwordHashAndSalt:String;
ingameName:String;

## Follow

follwer: String;
followee:String;

## Item

externalID: String;
icon:String;
itemSearchCategory:{name:String};
levelEquip: number;
levelItem:number;
name:String;

## Comment

message:String;
author:ObjectId;
item:ObjectId;

# PAGE LAYOUTS/SETUP

Home - Welcome message / Image / Go to sign in / Go to sign up / Community comments;
Sign-up - Form for sign up;
Sign-in - Form for sign in;
Profile - User Profile , adds user equiped items and favourite items, and followed characters.;
Search - Search results;
Item-details - Item details, list of followed comments and latest comments.;
Comments -

# ROUTES

GET - '/'->Renders Home page;

GET - '/Sign-in'->Renders sign-in page;
POST - '/Sign-in'->Submit sign-in form;
GET - '/sign-up'->Renders sign-up page;
POST - '/sign-up'->Submit sign-up form;

GET - '/profile' -> Renders profile pages insync with FFXIV API;
GET - '/profile/edit' -> Renders profile edit page;
POST - '/profile/edit' ->Submit profile edit;
POST - '/profile/delete' ->Deletes profile;

POST - '/search' -> Sends a request to FFXIV API or to the Database and returns array;
GET - '/search'-> Renders users search page with results from search;

GET - '/item/:id'-> Renders item details page;
POST- '/item/:id/save;
POST- '/item/:id/delete;

GET - '/comment' -> Renders users comments page;
POST- '/comment/:itemID/create ->create a new comment;
POST - '/comment/:id/edit' -> Edit User comment for the item;
POST - '/comment/:id/delete' ->Delete User comment for the item;
