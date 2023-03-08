import app   from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from "./dao/movieDAO.js"
import ReviewsDAO from './dao/reviewsDAO.js'

async function main(){
    
    //loading environmental variables
    dotenv.config()
    
    //initialising mongodb client
    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URI
    )

    const port = process.env.PORT || 8000

    try{
        //connecting to the MongoDB Cluster
        await client.connect()
        await MoviesDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)

        app.listen(port, ()=> {
            console.log('server is running on port:'+port)
        })

    } catch(e){
        console.error(e)
        process.exit(1)
    }
}

main().catch(console.error)