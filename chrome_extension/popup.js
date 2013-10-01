var hash;
var bkstring;
var server="your server path/submit_data.php";
var category;
window.onload=init;

function init(){

  $.ajax({
        url: server+'?options=1',
         //dataType: 'string',
          success: function(data) {
            //alert($('input[name=access]:checked').val());
            category=data.split("|||");
            //alert(category);
            for(i=0;i<category.length-1;i++)$("#ms6").append('<option value=" ' + category[i] + '">' +category[i]+ '</option>');   
           var ms6 = $('#ms6').magicSuggest({
                // will fetch data from options
            });
        } 
           });
}




function put(url,title,flag)
{
	
	var i;
 $("#image_loader").append('<center><img src="ajax-loader.gif" /></center>');
  $.ajax({
     //alert($('input[name=access]:checked', '#access').val());
     url: server+'?do=1&url='+url+"&title="+title + '&category=' + $("#category").val() + '&access=' + $('input[name=access]:checked').val() + '&toread=' + $('input[name=toread]:checked').val() + '&comment=' + $('#comment').val(),
     
     success: function(data) 
    {
       
       if(flag==1)
       {
        $('#error').slideDown(1500);
       $('#error').html("<center>"+data+"</center>"); 
       $('#error').slideUp(1500);
	   $("#image_loader").replaceWith('<center><b>Fostered Successfully</b></center>');
     }
       
    }
         });
}

function kmp(s, w) 
{
      var m = 0, i = 0, 
          pos, cnd, t,
          slen = s.length,
          wlen = w.length;
      
      /* String to array conversion */
      s = s.split("");
      w = w.split("");    
              
      /* Construct the lookup table */
      t = [-1, 0];
      for ( pos = 2, cnd = 0; pos < wlen; ) {
          if ( w[pos-1] === w[cnd] ) {
              t[pos] = cnd + 1;
              pos++; cnd++;
          }
          else if ( cnd > 0 )
            cnd = t[cnd];
          else 
            t[pos++] = 0;
      } 
      
      /* Perform the search */
      while ( m + i < slen ) {
          if ( s[m+i] === w[i] ) {
              i++;
              if ( i === wlen ) 
                return m;
          }
          else {
              m += i - t[i];
              if ( t[i] > -1 ) 
                  i = t[i];
              else
                  i = 0;
          }
      }
      return -1;
  }

$(function() {
  $('#search').keyup(function() {
     $('#bookmarks').empty();
     
    
     dumpBookmarks($('#search').val());
     
  });
});

function dumpBookmarks(query) 
{
  
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) 
    {

      dumpTreeNodes(bookmarkTreeNodes, query);
    });

}
function dumpTreeNodes(bookmarkNodes, query) 
{
  
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) 
  {
    
    dumpNode(bookmarkNodes[i], query);
  }
  
}
function dumpNode(bookmarkNode, query) 
{

   
  
    if (query && !bookmarkNode.children) 
    {
      if (kmp(String(bookmarkNode.url).toLowerCase(),query) == -1 && kmp(String(bookmarkNode.title).toLowerCase(),query) == -1 ) 
      {
        return ;
      }
    }
    
     
    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    if(kmp(String(bookmarkNode.url),"http")!=-1)
      anchor.text(bookmarkNode.title);

   
    anchor.click(function() {
       if(kmp(String(bookmarkNode.url),"http")!=-1)
      chrome.tabs.create({url: bookmarkNode.url});
    });
     
    var span = $('<li style="margin:10px 0px 0px 0px">');
    var options = bookmarkNode.children ?
      $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
      $('<span>[<a id="editlink" style="color:green" href="#">Edit</a> <a id="deletelink"  style="color:red"' +
        'href="#">Delete</a>]</span>');
    var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
      '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      '</td></tr></table>') : $('<input>');
    
        span.hover(function() {
        span.append(options);
        $('#deletelink').click(function() {
          $('#deletedialog').empty().dialog({
                 autoOpen: false,
                 title: 'Confirm Deletion',
                 resizable: false,
                 height: 140,
                 modal: true,
                 overlay: {
                   backgroundColor: '#000',
                   opacity: 0.5
                 },
                 buttons: {
                   'Yes, Delete It!': function() {
                      chrome.bookmarks.remove(String(bookmarkNode.id));
                      span.parent().remove();
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).dialog('open');
         });
        $('#addlink').click(function() {
          $('#adddialog').empty().append(edit).dialog({autoOpen: false,
            closeOnEscape: true, title: 'Add New Bookmark', modal: true,
            buttons: {
            'Add' : function() {
               chrome.bookmarks.create({parentId: bookmarkNode.id,
                 title: $('#title').val(), url: $('#url').val()});
               $('#bookmarks').empty();
               $(this).dialog('destroy');
               window.dumpBookmarks();
             },
            'Cancel': function() {
               $(this).dialog('destroy');
            }
          }}).dialog('open');
        });
        $('#editlink').click(function() {
         edit.val(anchor.text());
         $('#editdialog').empty().append(edit).dialog({autoOpen: false,
           closeOnEscape: true, title: 'Edit Title', modal: true,
           show: 'slide', buttons: {
              'Save': function() {
                 chrome.bookmarks.update(String(bookmarkNode.id), {
                   title: edit.val()
                 });
                 anchor.text(edit.val());
                 options.show();
                 $(this).dialog('destroy');
              },
             'Cancel': function() {
                 $(this).dialog('destroy');
             }
         }}).dialog('open');
        });
        options.fadeIn();
      },
      
      function() {
        options.remove();
      }).append(anchor);
        span.append('</li');
    
  
  if(kmp(String(bookmarkNode.url),"http")!=-1){
                                                $('#bookmarks').append(span);
                                              }
  if (bookmarkNode.children && bookmarkNode.children.length > 0) 
  {
    (dumpTreeNodes(bookmarkNode.children, query));
  }

  
}

function dumpBookmarks2(data2) 
{
   if(data2.indexOf("Please Login To Your Fosterzen Account")!=-1)
   {
    $('#error').slideDown(1000);
    $('#error').html("<center>"+"Please Login To Your Fosterzen Account"+"</center>");
      $('#error').slideUp(1000);
      return 0;
    }

  bkstring = "";
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) 
    { $('#error').slideDown(500);
      $('#error').html("<center>"+"Syncing....."+"</center>");


      dumpTreeNodes2(bookmarkTreeNodes);
      $.ajax({

     type: "POST",
     url: server,
     data:{data:bkstring},
     success: function(data) {


                                         var toadd=data2.split("|||");
                             var l=toadd.length-1,i;
                            
                        var bookmarkTreeNodes2 = chrome.bookmarks.getTree(
                        function(bookmarkTreeNodes2) 
                        {
                        
                         for(i=0;i<l;i+=2)
                         {
                         var str=String(toadd[i+1]);
                         if(hash[str]==1);
                         else addbk(bookmarkTreeNodes2,toadd[i],toadd[i+1]);
                         }
                        });
                                
                         $('#error').html("<center>"+"Bookmarks Synced"+"</center>");                      
                        $('#error').slideUp(1000);
                        
                         
                       //$('#error').html("");                               


                           }
            });
       });

}
function dumpTreeNodes2(bookmarkNodes) 
{
  
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) 
  {
    
    dumpNode2(bookmarkNodes[i]);
  }
  
}
function dumpNode2(bookmarkNode) 
{
  var i;
  if(kmp(String(bookmarkNode.url),"http")!=-1)
    {
      bkstring=bkstring.concat("|||",String(bookmarkNode.title),"|||",String(bookmarkNode.url));
      var str=String(bookmarkNode.url);
      hash[str]=1;
    }
  if (bookmarkNode.children && bookmarkNode.children.length > 0) 
  {
    dumpTreeNodes2(bookmarkNode.children);
  }
}




function myFunction2(url,title) 
{
put(String(url),String(title),1);
}


$(function() {
  $('#mark').click(function() {
     chrome.tabs.query({'active': true}, function (tabs) {
    myFunction2(tabs[0].url,tabs[0].title);
     });
     
  });
});


function addbk(bookmarkTreeNodes,v1,v2)
{

chrome.bookmarks.create({'parentId': bookmarkTreeNodes.id,
                         'title': v1,
                         'url': v2});
}



$(function() {
 bkstring="url";
  $('#sync').click(function() {
    
     
         
        $.ajax({
     url: server+'?sync=1',
     success: function(data) {

                              
                             if(1)
                             {
                              hash=new Array();
                              dumpBookmarks2(data);
                              

                            
                        result="Bookmark Synced";
                       }
                       else result="Please Login To Your Fosterzen Account";
                     
                     }

         });
       
          
       });
   });


   