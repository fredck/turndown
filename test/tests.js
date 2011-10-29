$(function(){
  
  test("converting p elements", function() {
    equal(toMarkdown("<p>Lorem ipsum</p>"), "Lorem ipsum", "We expect p tags to be wrapped with two line breaks");
    equal(toMarkdown("<p class='intro'>Lorem ipsum</p>"), "Lorem ipsum", "We expect p tags to be wrapped with two line breaks");
  });
  
  test("converting emphasis elements", function() {
    equal(toMarkdown("<b>Hello world</b>"), "**Hello world**", "We expect <b>Hello world</b> to be converted to **Hello world**");
    equal(toMarkdown("<strong>Hello world</strong>"), "**Hello world**", "We expect <strong>Hello world</strong> to be converted to **Hello world**");
    equal(toMarkdown("<b></b>"), "", "We expect b tags to be removed");
    
    equal(toMarkdown("<i>Hello world</i>"), "_Hello world_", "We expect <i>Hello world</i> to be converted to _Hello world_");
    equal(toMarkdown("<em>Hello world</em>"), "_Hello world_", "We expect <em>Hello world</em> to be converted to _Hello world_");
    equal(toMarkdown("<em id='one' class='cowabunga'>Hello world</em>"), "_Hello world_", "We expect <em id='one' class='cowabunga'>Hello world</em> to be converted to _Hello world_");
    equal(toMarkdown("<em id='one' class='cowabunga'></em>"), "", "We expect empty em tags to be removed");
  });
  
  test("converting inline code elements", function() {
    equal(toMarkdown("<code>print()</code>"), "`print()`", "We expect inline code tags to be converted to backticks");
    equal(toMarkdown("<code></code>"), "", "We expect empty code tags to be removed");
  });
  
  test("converting heading elements", function() {
    equal(toMarkdown("<h1>Hello world</h1>"), "# Hello world", "We expect <h1>Hello world</h1> to be converted to # Hello world");
    equal(toMarkdown("<h3>Hello world</h3>"), "### Hello world", "We expect <h3>Hello world</h3> to be converted to ### Hello world");
    equal(toMarkdown("<h6>Hello world</h6>"), "###### Hello world", "We expect <h6>Hello world</h6> to be converted to ###### Hello world");
    
    equal(toMarkdown("<h8>Hello world</h8>"), "<h8>Hello world</h8>", "We expect <h8>Hello world</h8> to be converted to <h8>Hello world</h8>");
  });
  
  test("converting hr elements", function() {
    equal(toMarkdown("<hr />"), "* * *", "We expect hr elements to be converted to * * *");
    equal(toMarkdown("<hr/>"), "* * *", "We expect hr elements to be converted to * * *");
    equal(toMarkdown("<hr>"), "* * *", "We expect hr elements to be converted to * * *");
    equal(toMarkdown("<hr class='fancy' />"), "* * *", "We expect hr elements to be converted to * * *");
  });
  
  test("converting br elements", function() {
    equal(toMarkdown("Hello<br />world"), "Hello\nworld", "We expect br elements to be converted to \n");
    equal(toMarkdown("Hello<br/>world"), "Hello\nworld", "We expect br elements to be converted to \n");
    equal(toMarkdown("Hello<br>world"), "Hello\nworld", "We expect br elements to be converted to \n");
  });
  
  test("converting img elements", function() {
    equal(toMarkdown("<img src='http://example.com/logo.png' />"), "![](http://example.com/logo.png)", "We expect img elements to be converted properly");
    equal(toMarkdown('<img src="http://example.com/logo.png" />'), "![](http://example.com/logo.png)", "We expect img elements to be converted properly");
    equal(toMarkdown("<img src='http://example.com/logo.png'>"), "![](http://example.com/logo.png)", "We expect img elements to be converted properly");
    equal(toMarkdown("<img src=http://example.com/logo.png>"), "![](http://example.com/logo.png)", "We expect img elements to be converted properly");

    equal(toMarkdown("<img src='http://example.com/logo.png' alt='Example logo' />"), "![Example logo](http://example.com/logo.png)", "We expect img elements to be converted properly with alt attrs");
    equal(toMarkdown("<img src='http://example.com/logo.png' alt='Example logo' title='Example title' />"), "![Example logo](http://example.com/logo.png \"Example title\")", "We expect img elements to be converted properly with alt and title attrs");
  });
  
  test("converting anchor elements", function() {
    equal(toMarkdown("<a href='http://example.com/about'>About us</a>"), "[About us](http://example.com/about)", "We expect anchor elements to be converted properly");
    equal(toMarkdown('<a href="http://www.example.com/about" title="About this company">About us</a>'), '[About us](http://www.example.com/about "About this company")', "We expect an anchor element with a title tag to have correct markdown");
    equal(toMarkdown('<a class="some really messy stuff" href="/about" id="donuts3" title="About this company">About us</a>'), '[About us](/about "About this company")', "We expect an anchor element with a title tag to have correct markdown");
    equal(toMarkdown('<a id="donuts3">About us</a>'), '<a id="donuts3">About us</a>', "Anchor tags without an href should not be converted");
  });
  
  test("converting code blocks", function() {
    var codeHtml = [
      "<pre><code>def hello_world",
      "  'Hello world!'",
      "end</code></pre>"
    ],
    codeMd = [
      "    def hello_world",
      "      'Hello world!'",
      "    end"
    ];
    equal(toMarkdown(codeHtml.join('\n')), codeMd.join('\n'), "We expect code blocks to be converted");
  });
  
  test("converting list elements", function() {
    equal(toMarkdown('1986. What a great season.'), '1986\\. What a great season.','We expect numbers that could trigger an ol to be escaped');
    equal(toMarkdown("<ol>\n\t<li>Hello world</li>\n\t<li>Lorem ipsum</li>\n</ol>"), "1.  Hello world\n2.  Lorem ipsum", "We expect ol elements to be converted properly");
    equal(toMarkdown("<ul>\n\t<li>Hello world</li>\n\t<li>Lorem ipsum</li>\n</ul>"), "*   Hello world\n*   Lorem ipsum", "We expect ul elements with line breaks and tabs to be converted properly");
    equal(toMarkdown("<ul class='blargh'><li class='first'>Hello world</li><li>Lorem ipsum</li></ul>"), "*   Hello world\n*   Lorem ipsum", "We expect ul elements with attributes to be converted properly");
    equal(toMarkdown("<ul><li>Hello world</li><li>Lorem ipsum</li></ul><ul><li>Hello world</li><li>Lorem ipsum</li></ul>"), "*   Hello world\n*   Lorem ipsum\n\n*   Hello world\n*   Lorem ipsum", "We expect multiple ul elements to be converted properly");
    equal(toMarkdown("<ul><li><p>Hello world</p></li><li>Lorem ipsum</li></ul>"), "*   Hello world\n\n*   Lorem ipsum", "We expect li elements with ps to be converted properly");
    
    var lisWithPsHtml = [
      "<ol>",
      "  <li>",
      "    <p>This is a list item with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.</p>",
      "    <p>Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec sit amet nisl. Aliquam semper ipsum sit amet velit.</p>",
      "  </li>",
      "  <li>",
      "    <p>Suspendisse id sem consectetuer libero luctus adipiscing.</p>",
      "  </li>",
      "</ol>"
    ].join('\n'),
    
    lisWithPsMd = [
      "1.  This is a list item with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.",
      "",
      "    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec sit amet nisl. Aliquam semper ipsum sit amet velit.",
      "",
      "2.  Suspendisse id sem consectetuer libero luctus adipiscing."
    ].join('\n');
    
    equal(toMarkdown(lisWithPsHtml), lisWithPsMd,'We expect lists with paragraphs to be converted');
    
    var nestedListHtml = [
      "<ul>",
      "  <li>This is a list item at root level</li>",
      "  <li>This is another item at root level</li>",
      "  <li>",
      "    <ul>",
      "      <li>This is a nested list item</li>",
      "      <li>This is another nested list item</li>",
      "      <li>",
      "        <ul>",
      "          <li>This is a deeply nested list item</li>",
      "          <li>This is another deeply nested list item</li>",
      "          <li>This is a third deeply nested list item</li>",
      "        </ul>",
      "      </li>",
      "    </ul>",
      "  </li>",
      "  <li>This is a third item at root level</li>",
      "</ul>"
    ].join('\n'),
    nestedListMd = [
      "*   This is a list item at root level",
      "*   This is another item at root level",
      "*   *   This is a nested list item",
      "    *   This is another nested list item",
      "    *   *   This is a deeply nested list item",
      "        *   This is another deeply nested list item",
      "        *   This is a third deeply nested list item",
      "*   This is a third item at root level"
    ].join('\n');
    // equal(toMarkdown(nestedListHtml), nestedListMd, "We expect nested lists to be converted properly");
    
    nestedListHtml = "<ul>\
      <li>This is a list item at root level</li>\
      <li>This is another item at root level</li>\
      <li>\
        <ol>\
          <li>This is a nested list item</li>\
          <li>This is another nested list item</li>\
          <li>\
            <ul>\
              <li>This is a deeply nested list item</li>\
              <li>This is another deeply nested list item</li>\
              <li>This is a third deeply nested list item</li>\
            </ul>\
          </li>\
        </ol>\
      </li>\
      <li>This is a third item at root level</li>\
    </ul>";
    nestedListMd = [
      "*   This is a list item at root level",
      "*   This is another item at root level",
      "*   1.  This is a nested list item",
      "    2.  This is another nested list item",
      "    3.  *   This is a deeply nested list item",
      "        *   This is another deeply nested list item",
      "        *   This is a third deeply nested list item",
      "*   This is a third item at root level"
    ];
    // equal(toMarkdown(nestedListHtml), nestedListMd.join('\n'), "We expect nested lists to be converted properly");
  });
});