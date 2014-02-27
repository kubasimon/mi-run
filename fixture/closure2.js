function main() {
    // Local variable that ends up within closure
    var num = 666;
    var sayAlert = function() { print(num); }
    num++;
    sayAlert();
}