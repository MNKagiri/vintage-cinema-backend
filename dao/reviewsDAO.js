import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO{

    static async injectDB(conn){
            if(reviews){
                return
            }
            try {
                reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews')
            } catch(e){
                console.error(`unable to establish connection handle in reviewDAO: ${e}`)
            }
    }
    static async getReviewById(id){
        try{
            return await reviews.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                }
            ]).next()
        } catch (e){
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    
    } 

    static async addReview(user_id, movie_title, movie_id, review, date){
        try {
            const reviewDoc = {
                userId: user_id,
                movieTitle: movie_title,
                movieId: movie_id,     
                review: review,
                date: date
            }

            return await reviews.insertOne(reviewDoc)
        } catch(e){
            console.error(`unable to post review: ${e}`)
            return { error:e}
        }
    }

    static async updateReview(reviewId, userId, review, date){
        try{
            const updateResponse = await reviews.updateOne(
                {user_id: userId, _id:ObjectId(reviewId)},
                {$set:{review:review, date:date}}
            )

            return updateResponse
        }
        catch(e){
            console.error(`unable to update review: ${e}`)
            return {error: e}
        }
    }

    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })
            return deleteResponse
        } catch(e) {
            console.error(`unable to delete review: ${e}`)
            return  { error: e}
        }
    } 
   
}