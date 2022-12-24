class ApiFeatures {

    constructor(query, queryStr){
        this.query = query;
        this.queryStr =  queryStr;
    }

    // search method to find the product using keyword
        search(){
            // ? operaor tells ke jo chez search ke hy wo milli hy ke nai
            const keyword = this.queryStr.keyword 
            ? {
    name:{
        $regex : this.queryStr.keyword,
        $options :"i",
            },
            }
            :{};
            // console.log(keyword);
            this.query = this.query.find({...keyword});
            return this;
        }

        // filter methof to filterout the products
        // filter ---> iss mein hum category ke according --> filter karty hein 
        filter()
        {
                const queryCopy = {...this.queryStr};
                // removing feild from the category
                const removeFeilds = ["keyword","page","limit"];
                removeFeilds.forEach((key) => delete queryCopy[key]);
                // filter for "Price" + "Rating " and it will be in range segment
                let queryStr = JSON.stringify(queryCopy);
                // this statement replace gt-->greate than gte-->greater than equal to  
                queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

                // this.query mean product.find
                this.query = this.query.find(JSON.parse(queryStr));
                return this;                
        }
        // pagenation 
        // hmara result per page is 5
        pagination(resultPerPage){
            // sub se pehle we create our current page 
            const currentPage =  Number(this.queryStr.page) || 1;
            
        //skip ke kitne products skip karni hein  // 50 -10 
        // let say hum 1st page par hein so 1-0 =0 so 0 skip hu ge 0 * 10 =0
        // and if we are on 2nd page 2-1 =1  ) 1 * 10 = 10 skip hu ge
        // same essse he hu ga iss neche wali line ke yeh logic hy
        const skip = resultPerPage * (currentPage - 1);
        // this.query mean find method .limit lgany sy ab limit lag gaye hy ke start ke 10 product show karwye
        // than next page ke lye agli 10 skip kar de
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;

        }
    }
    module.exports = ApiFeatures;
