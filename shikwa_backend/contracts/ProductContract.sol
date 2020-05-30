pragma solidity >=0.4.21 <0.7.0;

contract ProductContract {
    
    //Key = user email, Value = products id
    mapping (string => uint[]) public userData;
    
    uint private totalProducts = 0;

    //Key = Product id, value = product
    mapping(uint => Product) public products;

    //Product Structure
    struct Product {
        uint id;
        string productName;
        string productBrand;
        string productCategory;
        string countryOrigin;
        string cityOrigin;
        string ristType;
        string description;
    }

    function addProduct(string memory _user, string memory _productName, string memory _productBrand , string memory _productCategory , string memory _countryOrigin , string memory _cityOrigin , string memory _ristType , string memory _description) public {
        totalProducts++;

        Product memory product = Product({
            id: totalProducts,
            productName: _productName,
            productBrand: _productBrand,
            productCategory: _productCategory,
            countryOrigin: _countryOrigin,
            cityOrigin: _cityOrigin,
            ristType: _ristType,
            description: _description
        });

        products[totalProducts] = product;
        userData[_user].push(totalProducts);
    }

    function getProduct(uint productId) public view returns (uint, string memory, string memory, string memory , string memory , string memory, string memory, string memory) {
        Product memory product = products[productId];
        require(product.id > 0, "Product not found");

        return (product.id, product.productName, product.productBrand, product.productCategory, product.countryOrigin, product.cityOrigin, product.ristType, product.description);
    }
}