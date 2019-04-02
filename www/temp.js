//--- Hanchiang News ---
function getNews() {
  showLoader();
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .param('_embed')
    .perPage(1)
    .then(function(posts) {
      posts.forEach(function(post) {
        console.log(post);

        //getThumbnail(post.featured_media);

        // console.log('Title: ' + post.title.rendered);
        // console.log('Excerpt: ' + post.excerpt.rendered);
        // console.log('Thumbnail: ' + getThumbnail(post.featured_media));
        // console.log('Content: ' + post.content.rendered);

        newsContent += post.title.rendered;
        newsContent += post.excerpt.rendered;
        newsContent += '<img src= "';
        newsContent += getThumbnail(post.featured_media);
        newsContent += '">';
      });
      $('.ui-content').html(newsContent);
      hideLoader();
    });
  $('#top-title').html('Latest News');
}
