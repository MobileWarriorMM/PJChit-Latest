export default checkThePassword = (password) => {
    var re = {
        //capital: /(?=.*[A-Z])/,
        length: /(?=.{8,20}$)/,
        //specialChar: /[ -\/:-@\[-\`{-~]/,
        //digit: /(?=.*[0-9])/,
    };
    return (
        //re.capital.test(password) &&
        re.length.test(password) 
        //&&re.specialChar.test(password) &&
        //re.digit.test(password)
    );
}