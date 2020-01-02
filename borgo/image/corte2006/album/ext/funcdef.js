///////////////////////////
function ShowingFirstImage() {
///////////////////////////

    if (parent.intro!='') {

        return parent.currentImage==-1;
    }

    return parent.currentImage==0;
}


///////////////////////////
function ShowingLastImage() {
///////////////////////////

    return parent.currentImage==parent.nbImages-1;
}


///////////////////////////
function ShowHome() {
///////////////////////////

    ShowImage( -1, 1 );
}


///////////////////////////
function Next() {
///////////////////////////

    if ( !ShowingLastImage() ) {

        ShowImage( parent.currentImage+1, 1 );
    }
}


///////////////////////////
function Previous() {
///////////////////////////

    if ( !ShowingFirstImage() ) {

        ShowImage( parent.currentImage-1, 1 );
    }
}


//////////////////////////
function ImageFile( imgNb ) {
//////////////////////////

    return parent.imageFilename[imgNb];
}


///////////////////////////////////
function GetMinorCaption(imgNb) {
///////////////////////////////////

    var cap = parent.minorCaption[imgNb];
    return cap;
}


///////////////////////////////////
function GetMajorCaption(imgNb) {
///////////////////////////////////

    return parent.majorCaption[imgNb];
}

///////////////////////////////////
function ShowHidePrevNext() {
///////////////////////////////////

    var mfd = parent.frames['main'].document;
    if (mfd.getElementById) {

        //mfd.getElementById('previous').style.visibility = ShowingFirstImage() ? 'hidden' : 'visible';
        //mfd.getElementById('next').style.visibility = ShowingLastImage() ? 'hidden' : 'visible';
        mfd.getElementById('previous').style.display = ShowingFirstImage() ? 'none' : 'inline';
        mfd.getElementById('next').style.display = ShowingLastImage() ? 'none' : 'inline';
    }
}

///////////////////////////////////
function WaitCursorOn() {
///////////////////////////////////

    if (document.getElementsByTagName) {

        for(f=0;f<parent.frames.length;f++) {

            var doc = parent.frames[f].document;
            var e;
            e = doc.getElementsByTagName('body');
            for(i=0;i<e.length;i++) { e.item(i).style.cursor = 'wait'; }
            e = doc.getElementsByTagName('a');
            for(i=0;i<e.length;i++) { e.item(i).style.cursor = 'wait'; }
            e = doc.getElementsByTagName('table');
            for(i=0;i<e.length;i++) { e.item(i).style.cursor = 'wait'; }
        }
    }
}

///////////////////////////////////
function WaitCursorOff() {
///////////////////////////////////

    if (document.getElementsByTagName) {

        for(f=0;f<parent.frames.length;f++) {

            var doc = parent.frames[f].document;
            var e;
            e = doc.getElementsByTagName('body');
            for(i=0;i<e.length;i++) { e.item(i).style.cursor = 'default'; }
            e = doc.getElementsByTagName('a');
            for(i=0;i<e.length;i++) { e.item(i).style.cursor = 'pointer'; }
            e = doc.getElementsByTagName('table');
            for(i=0;i<e.length;i++) { e.item(i).style.cursor = 'default'; }
        }
    }
}


///////////////////////////////////
var cacheImage = new Image();
///////////////////////////////////
function CacheNextImage() {
///////////////////////////////////

    // cache the next image
    if (!parent.showAll && parent.currentImage<parent.nbImages-1 ) {

        cacheImage.src = 'medium/'+ImageFile(parent.currentImage+1);
    }
}


/////////////////////////////////////////////////////////////////////////////
// private functions used by ShowImage()
/////////////////////////////////////////////////////////////////////////////
        var mainImage = new Image();
        
        ///////////////////////////////////////////
        function MainImageLoadDone() {
        ///////////////////////////////////////////

            // setup
            var imgNb = parent.currentImage;
            var mfd = parent.frames['main'].document;

            // set major caption
            if (mfd.getElementById) {

                mfd.getElementById('caption').innerHTML = GetMajorCaption(imgNb);
            }

            // set minor caption
            mfd.images['imagepane'].title = GetMinorCaption(imgNb);
            mfd.images['imagepane'].alt = GetMinorCaption(imgNb);

            // hide/show next, previous links
            ShowHidePrevNext();

            // turn off the wait cursor
            WaitCursorOff();

            // cache next image
            CacheNextImage();
        }

        ///////////////////////////////////////////
        function LoadMainImage() {
        ///////////////////////////////////////////

            // setup
            var imgNb = parent.currentImage;
            var mfd = parent.frames['main'].document;

            // turn on wait cursor
            WaitCursorOn();

            // set large link (DOM browsers only: IE 5+, Mozilla, Netscape 6+, Opera 5+)
            //if (parent.largeImages && mfd.getElementsByTagName) {
            if (parent.largeImages && mfd.getElementById) {

                //mfd.getElementsByTagName('a').namedItem('largelink').href = 'javascript:OpenLarge('+imgNb+')';
                mfd.getElementById('largelink').href = 'javascript:OpenLarge('+imgNb+')';
            }

            // show main image
            mfd.images['imagepane'].onload = MainImageLoadDone; // execution is continued here...
            mfd.images['imagepane'].src = 'medium/'+ImageFile(imgNb);
            
            // nasty opera work-around			
			var isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
			if (isOpera) {
				
				// image onload is not supported, hence call it directly
				MainImageLoadDone();				
			}
        }        
/////////////////////////////////////////////////////////////////////////////
// end of private functions
/////////////////////////////////////////////////////////////////////////////


//////////////////////////
function ShowImage( imgNb, scrollsmall ) {
// changes 'parent.currentImage'
//////////////////////////

    if ( parent.currentImage==imgNb ) {

        // same image -> do nothing
        return;
    }

    var mfd = parent.frames['main'].document;
    if ( parent.currentImage==-1 || imgNb==-1 || parent.showAll ) {

        // set the current image number
        parent.currentImage = imgNb;

        //  a reload is needed
        parent.showAll = 0;
        //parent.frames['main'].location.reload();
        parent.frames['main'].location.href = 'medium.html';

    }   else {

        // sanity checks
        imgNb = Math.max( 0, imgNb );
        imgNb = Math.min( imgNb, parent.nbImages-1 );

         // set the current image number
        parent.currentImage = imgNb;

        // load image, captions, et cetera
        LoadMainImage();
    }

    // scroll to show corresponding small image
    if (scrollsmall && parent.frames['small']) {

        anchor = imgNb>0 ? imgNb : 'top';
        parent.frames['small'].document.location.href = 'small.html#'+anchor;
    }
}


/////////////////////////////////////////
function ImageBrowsingKeydownHandler(e) {
/////////////////////////////////////////

    if (!e) e = window.event;
    if (e.type!='keydown') { return; }

    switch (e.keyCode) {

        case 37:    // left_arrow
                    Previous();
                    break;

        case 39:    // right_arrow
        case 32:    // space_key
                    Next();
                    break;
        default:   //alert(event.keyCode);
    }
}


//////////////////////////
function ShowAll() {
//////////////////////////

    parent.showAll = 1;
    parent.currentImage = -2;
    parent.frames['main'].location.reload();
}


///////////////////////////
function OpenLarge(imgNb) {
// changes 'parent.currentImage'
///////////////////////////

    // 'imgNb' is now the current image
    parent.currentImage = imgNb;

    var w = parent.largeWidth[imgNb];
    var h = parent.largeHeight[imgNb];
    var sw = screen ? screen.width : w;
    var sh = screen ? screen.height : h;
    var scrollbars = 'no';
    var gutter = 100;
    
    if (sw-gutter<w || sh-gutter<h) {

        scrollbars = 'yes';
        w = sw-gutter;
        h = sh-gutter;

    } 

    window.open('large.html',
                '',
                'width='+w+
                ',height='+h+
                ',resizable=yes,menubar=no,toolbar=no,status=no,location=no'+
                ',scrollbars='+scrollbars+
                ',left='+( (sw-w)/2 )+
                ',top='+( (sh-h)/2 )+
                ',screenX='+( (sw-w)/2 )+
                ',screenY='+( (sh-h)/2 ) );
}


///////////////////////////
function PortaMagicFooter( str ) {
///////////////////////////
	
	var p_link = ' <a href=\"http://www.stegmann.dk/mikkel/porta/\" target=\"_blank\" class=footer>Porta</a>';
	return str.replace( / Porta/g, p_link );
}