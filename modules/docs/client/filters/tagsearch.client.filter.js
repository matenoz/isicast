'use strict';

// Docs filter
angular.module('docs').filter('filterByTags', function () {     
  return function (items, tags) {
    var filtered = [];
    if (tags.length === 0) {
      filtered = items;
    }
    (items || []).forEach(function(item){
      (item.tags).forEach(function(tag_){
        var matches = tags.some(function(tag){
          return (tag_.text.indexOf(tag.text) > -1);
        });
        if(matches){
          filtered.push(item);
        }
      });
    });
    return filtered;
  };
});
