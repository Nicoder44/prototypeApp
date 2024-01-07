// db/db.js

const mongoose = require('mongoose');
const Blog = require('./blog');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion réussie à MongoDB');

    const blog = new Blog({
        titre: "Titre1",
        contenu: "Contenu1"
    });

    //const result = await blog.save(blog);
    /*const result = await Blog.create({
        titre: "Titre2",
        contenu: "Contenu2"
    });*/
    
    const result = await Blog.insertMany([
      {
        titre: "Mon titre",
        contenu: "Mon contenu"
      },
      {
        titre: "Mon titre1",
        contenu: "Mon contenu1"
      }
    ])
    
    console.log(result);

  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
    
    process.exit(1); // Arrête l'application en cas d'échec de la connexion à la base de données
  }
};

module.exports = connectDB;