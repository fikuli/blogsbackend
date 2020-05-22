const _ = require("lodash");
const logger = require('../utils/logger')

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
      }
    
      return blogs.reduce(reducer, 0)
}
  
const favoriteBlog = (blogs) => {

    if(blogs.length==0)return null
    
    let item = blogs[0]
    

    let i=1;
    for (i = 1; i < blogs.length; i++) {
        if(blogs[i].likes>item.likes)item = blogs[i];
    }
    
    return {
        "title": item.title,
        "author": item.author,
        "likes": item.likes
    }
}


const mostBlogs = (blogs) => {

    if(blogs.length==0)return null

    let max = 0
    let eleman = ''
    let tally = _.reduce(blogs, (total, next) => {

        total[next.author] = (total[next.author] || 0) + 1 ;
        if(max<total[next.author]){
            max = total[next.author]
            eleman = next.author
        }
        return total;
      }, {});

      logger.info(tally)

      return {"author": eleman, "blogs": max}

}
  
const mostLikes = (blogs) => {
    if(blogs.length==0)return null

    let max = 0
    let eleman = ''
    let tally = _.reduce(blogs, (total, next) => {

        total[next.author] = (total[next.author] || 0) + next.likes ;
        if(max<total[next.author]){
            max = total[next.author]
            eleman = next.author
        }
        return total;
      }, {});

      logger.info(tally)

      return {"author": eleman, "likes": max}

}
  
module.exports = {
    dummy,
    totalLikes, favoriteBlog, mostBlogs, mostLikes
}