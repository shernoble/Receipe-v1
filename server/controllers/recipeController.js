require("../models/database"); //to make them connections
// for random number generation
const { log } = require("util");
const Category=require("../models/Category");
const Recipe=require("../models/Recipe");


// GET /
// homepage

exports.homepage=async(req,res)=>{
    try{

        const limitNumber=5;
        const categories=await Category.find({}).limit(limitNumber);
        const latest=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        const thai=await Recipe.find({category:"Thai"}).limit(limitNumber);
        const american=await Recipe.find({category:"American"}).limit(limitNumber);
        const chinese=await Recipe.find({category:"Chinese"}).limit(limitNumber);
        const food={latest,thai,american,chinese};
        res.render('index',{title:"Cooking Blog - HomePage",categories,food});

    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
        // console.log(error);

    }


}

// GET /
// categories

exports.exploreCategories=async(req,res)=>{
    try{

        const limitNumber=20;
        const categories=await Category.find({}).limit(limitNumber);
        res.render('categories',{title:"Cooking Blog - HomePage",categories});

    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
        // console.log(error);

    }


}



// GET /category/:id
// categories

exports.exploreCategoriesByName=async(req,res)=>{
    try{
        const categoryName=req.params.name;
        const categoryID=await Recipe.find({'category':categoryName});
        res.render('categories',{title: 'Cooking Blog - '+categoryName,categoryID})
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
        // console.log(error);

    }


}

// GET /recipe/:id
// Recipe

exports.exploreRecipe=async(req,res)=>{
    try{
        let recipeId=req.params.id;
        const recipe=await Recipe.findById(recipeId);
        res.render("recipe",{title:'Cooking Blog-Recipe',recipe});
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}

// POST /search
// search



exports.searchRecipe=async(req,res)=>{
    try{
        let searchTerm=req.body.searchTerm;

        let recipe=await Recipe.find({$text:{$search:searchTerm,$diacriticSensitive:true}});
        // res.json(recipe);

        res.render("search",{title:'Cooking Blog - Search',recipe})
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}


//GET /exploreLatest

exports.exploreLatest=async(req,res)=>{
    try{
        const limitNumber=20;
        const recipe=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);

        res.render("explore-latest",{title:'Cooking Blog - Explore Latest',recipe});
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}

exports.exploreRandom=async(req,res)=>{
    try{
        const count=await Recipe.find().countDocuments();
        const rnd=Math.floor(Math.random()*count);
        let recipe=await Recipe.findOne().skip(rnd).exec();
        // res.json(recipe);
        res.render("explore-random",{title:'Cooking Blog - Explore Random',recipe})
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}

// GET /submit-recipe

exports.submitRecipe=async(req,res)=>{
    try{
        //obj is gonna hold all the errors we want to display to the user
        const infoErrorsObj=req.flash('infoErrors');
        const infoSubmitObj=req.flash('infoSubmit');
        res.render("submit-recipe",{title:"Cooking Blog - Submit Recipe",infoErrorsObj,infoSubmitObj});
    }
    catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}


exports.submitRecipeOnPost=async(req,res)=>{
    try{
        let imageUploadFile,newImageName,uploadPath;

        if(!req.files || Object.keys(req.files).length===0){
            console.log("no files were uploaded");
        }
        else{
            console.log(req.files.image);
            imageUploadFile=req.files.image;
            newImageName=Date.now()+imageUploadFile.name;
            uploadPath=require('path').resolve('./')+'/public/uploads'+newImageName;
            imageUploadFile.mv(uploadPath,function(err){
                if(err) console.log(err);
            });


        }

        const newRecipe=new Recipe({
            name:req.body.name,
            description:req.body.description,
            email:req.body.email,
            ingredients:req.body.ingredients,
            category:req.body.category,
            image:newImageName
        });

        await newRecipe.save();

        req.flash('infoSubmit','Recipe has been added.');
        res.redirect("/submit-recipe");
    }
    catch(error){
        req.flash('infoErrors',error);
        res.redirect("/submit-recipe");
    }
}



// const data=[
//     {
//         "name": "Spicy Thai Basil Chicken",
//         "description": "A delicious and aromatic Thai dish made with chicken, basil, and spices.",
//         "email": "example@example.com",
//         "ingredients": ["500g boneless chicken, sliced", "2 tablespoons vegetable oil", "3 cloves garlic, minced", "1 red chili, sliced", "1 onion, sliced", "1 bell pepper, sliced", "1 cup fresh basil leaves", "2 tablespoons soy sauce", "1 tablespoon oyster sauce", "1 teaspoon sugar"],
//         "category": "Thai",
//         "image": "thai-food.jpg"
//     },
//     {
//         "name": "Classic Cheeseburger",
//         "description": "An all-time favorite American dish made with juicy beef patty, melted cheese, and fresh toppings.",
//         "email": "example@example.com",
//         "ingredients": ["200g ground beef", "1 hamburger bun", "1 slice of cheddar cheese", "1 tomato, sliced", "1 lettuce leaf", "1 onion, sliced", "Ketchup and mustard, to taste", "Salt and pepper, to taste"],
//         "category": "American",
//         "image": "american-food.jpg"
//     },
//     {
//         "name": "Sweet and Sour Chicken",
//         "description": "A popular Chinese dish featuring crispy chicken pieces in a tangy and flavorful sauce.",
//         "email": "example@example.com",
//         "ingredients": ["500g boneless chicken, cubed", "1/2 cup pineapple chunks", "1 green bell pepper, sliced", "1 red bell pepper, sliced", "1 onion, diced", "2 cloves garlic, minced", "1/4 cup ketchup", "2 tablespoons rice vinegar", "2 tablespoons soy sauce", "2 tablespoons brown sugar"],
//         "category": "Chinese",
//         "image": "chinese-food.jpg"
//     },
//     {
//         "name": "Spicy Chicken Enchiladas",
//         "description": "A delicious Mexican dish made with tortillas, shredded chicken, spicy sauce, and melted cheese.",
//         "email": "example@example.com",
//         "ingredients": ["2 cups cooked chicken, shredded", "8 tortillas", "1 cup enchilada sauce", "1 cup shredded cheese", "1/2 cup diced tomatoes", "1/4 cup chopped cilantro", "1/4 cup diced onion", "1 jalapeno, sliced (optional)", "1 tablespoon vegetable oil"],
//         "category": "Mexican",
//         "image": "mexican-food.jpg"
//     }      
// ];

// async function insertDummyCategoryData(){
//     // async kyu??
//     try{
//         await Recipe.insertMany(data);
//         console.log("data inserted!");
//     }
//     catch(error){
//         console.log("err",+error);
//     }
// }

// insertDummyCategoryData();