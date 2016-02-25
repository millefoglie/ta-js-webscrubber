`util.js` contains functions which convert stores data to an html page.

To run the tasks, PhantomJS has to be present. The scripts can be launched as `phantomjs task.js`. For some reasons there may be errors output to stderr or other glitches, but these scripts did produce the desired lists of data.

# Task 1

The most contemporary web systems use APIs to get the data to be injected into the HTML instead of writing this data directly on web page HTML file. One of these cases is http://www.urbanoutfitters.com. Write a JS script to get all the UK stores under the section Store Locator (http://www.urbanoutfitters.com/uk/stores). Provide the results in a very simple web page (text only) Fields to collect: id, address, country, postal code, latitude and longitude. Send to us: Javascript code + web page printscreen

## Implementation details

To solve the tasks I have decided to use PhantomJS, which is basically a headless webkit browser which runs in the console. This allows to output data to an external file, but, because of poor documentation and lack of verbose error messages, the code quality turned out to be not as good as I would like it to be.

One possible solution to the first task would be automating the input of the required country and traversing the list of elements on the page containing the required information. We can also trigger 'click' event on the 'Show More' button to load all stores. Then we just need to parse the page and extract data. This is done in `task1-dumb.js`.

However this approach does not look very elegant and requires a lot of extra code. Which is why examined the website structure and found out that the desired data can be easily obtained by calling `myBWAPI.all_stores()` function. This function provides an array of stores with everything we are looking for and that can be easily filtered and formatted. This is what happens in `task1.js`.

Unfortunately, there is some glitch with PhantomJS and one of js libraries on the website which throws errors. Other than that, everything works fine.

# Task 2

Some websites need some type of interaction before we get the data we want. One example is when you need to make a request to get a small piece of information to be used (it can be cookies, api key, etc.) in the next request which will return the real data. True Value (http://www.truevalue.com/store_locator.jsp) uses an external API to get their data. Since the API provider is a general one (so we can have several websites using the service), there is an API key for each customer. True Value needs to provide this API key in order to get the data they want from the API provider. The API key is usually obtained through a request or it is stored in the HTML itself. This exercise is representative of the flow: make a request -> get piece of information -> make request with piece of information. The task is to write a small javascript script that get data for zipcode 20004 and 94101 and render it in an html page, like in the previous exercise. Send to us: Javascript code + web page printscreen 

## Implementation details

The required data can be obtained through a REST service on http://hosted.where2getit.com/truevalue/. The only difficulty here is finding the correct request parameters. I have found out that this service demands an xml\_request data and the format of this request corresponds to the W2GI object on http://hosted.where2getit.com/truevalue/index2015.html (this is the source of the map and data iframe on the store\_locator page).

Thus, what I do is get the apikey from the corresponding page, perform xml requests and parse xml responses. However, it would be possible to skip the requests for getting apikey, since it does not change, and proceed to xml requests immediately.

Also, no data for 94101 was available on the website.