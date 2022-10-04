/////////REUSABLE CLASS OF ALL API FEATURES
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //////FILTER QUERY/////
    const { page, sort, limit, fields, ...queryObj } = this.queryString; //Only want the main query obj and ignore other four queries

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, (match) => `$${match}`); //Advance filter for greater than, greater than equal, less than, less than equal

    this.query = this.query.find(JSON.parse(queryStr)); //Find all tour that match query
    return this; //Return the entire obj which has access to other methods
  }

  sort() {
    //////SORT QUERY//////
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    /////FIELD LIMIT QUERY////
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); //Exclude the __v field
    }
    return this;
  }

  paginate() {
    //////PAGINATION QUERY/////
    const pageNum = this.queryString.page * 1 || 1;
    const limitNum = this.queryString.limit * 1 || 100;
    const skipNum = (pageNum - 1) * limitNum;

    this.query = this.query.skip(skipNum).limit(limitNum);

    return this;
  }
}

module.exports = APIFeatures;
