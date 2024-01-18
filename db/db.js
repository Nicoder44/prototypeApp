// db/db.js

const mongoose = require('mongoose');
const Blog = require('./blog');

const findBlog = async (Id) => {
  try{
    const reqresult = await Blog.findById(Id);
    console.log(reqresult);
    return reqresult;
  } catch(error){
    console.error('Erreur lors de la recherche en bdd: ', error);
    throw error;
  }
    
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion réussie à MongoDB');

    const blog = new Blog({
        titre: "Titre1",
        contenu: "Contenu1"
    });

    //const result = await blog.save(blog);
    const result = await Blog.create({
        titre: "Titre2",
        contenu: "Contenu2"
    });
    
    /*const result = await Blog.insertMany([
      {
        titre: "Mon titre",
        contenu: "Mon contenu"
      },
      {
        titre: "Mon titre1",
        contenu: "Mon contenu1"
      }
    ])*/
    /*
    console.log(result);
    const reqresult = await Blog.findById("659aacac68b0ba3c805f294a");
    console.log("trouvé" + reqresult);*/

  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
    
    process.exit(1); // Arrête l'application en cas d'échec de la connexion à la base de données
  }
};

module.exports = { connectDB, findBlog };