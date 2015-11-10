
// See http://en.wikipedia.org/wiki/Kruskal's_algorithm
// and http://programmingpraxis.com/2010/04/06/minimum-spanning-tree-kruskals-algorithm/

var nodes = ["A", "B", "C", "D", "E", "F", "G"];
var edges = [
    ["A", "B", 7], ["A", "D", 5],
    ["B", "C", 8], ["B", "D", 9], ["B", "E", 7],
    ["C", "E", 5],
    ["D", "E", 15], ["D", "F", 6],
    ["E", "F", 8], ["E", "G", 9],
    ["F", "G", 11]
];


function contains (tree, node) {

}

function kruskal (nodes, edges) {
    var mst = [];
    var forest = nodes.map(function(node) { return [node]; });

    edges = edges.slice();
    edges.sort(function (a, b) {
        if (a[2] === b[2]) {
            return 0;
        }
        else if (a[2] < b[2]) {
            return -1;
        }
        
        return 1;
    });

    while (forest.length > 1) {
        var edge = edges.pop();
        var n1 = edge[0],
            n2 = edge[1];

        var t1 = forest.filter(function(tree) {
            return _.include(tree, n1);
        });
            
        var t2 = forest.filter(function(tree) {
            return _.include(tree, n2);
        });

        if (t1 != t2) {
            forest = _.without(forest, t1[0], t2[0]);
            forest.push(_.union(t1[0], t2[0]));
            mst.push(edge);
        }
    }
    return mst;
}

console.log(kruskal(nodes, edges));



//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// Return all the elements that pass a truth test.
// Aliased as `select`.
_.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
        if (predicate(value, index, list)) results.push(value);
    });
    return results;
};

