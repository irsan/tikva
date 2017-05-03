function Pagination(page, limit) {
    this.count = 0;
    this.currentPage = page;
    this.page = page > 0 ? page : 1;
    this.page--;
    this.limit = limit ? limit : 20;
    this.offset = this.page * this.limit;
};

Pagination.prototype.setCount = function(count) {
    this.count = count;
    this.lastPage = (this.count == 0) ? 0 : Math.ceil(this.count / this.limit);
};

Pagination.prototype.getLastPage = function() {
    if(this.count == 0) {
        return 0;
    }

    return Math.ceil(this.count / this.limit);
}

Pagination.prototype.toJSON = function() {
    delete this.page;
    delete this.offset;
    return this;
};

module.exports = Pagination;