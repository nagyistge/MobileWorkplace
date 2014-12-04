/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP SE or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.Popover");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Popover",{metadata:{interfaces:["sap.ui.core.PopupInterface"],publicMethods:["close","openBy","isOpen"],library:"sap.m",properties:{"placement":{type:"sap.m.PlacementType",group:"Behavior",defaultValue:sap.m.PlacementType.Right},"showHeader":{type:"boolean",group:"Appearance",defaultValue:true},"title":{type:"string",group:"Appearance",defaultValue:null},"modal":{type:"boolean",group:"Behavior",defaultValue:false},"offsetX":{type:"int",group:"Appearance",defaultValue:0},"offsetY":{type:"int",group:"Appearance",defaultValue:0},"contentWidth":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"contentHeight":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"enableScrolling":{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},"verticalScrolling":{type:"boolean",group:"Misc",defaultValue:true},"horizontalScrolling":{type:"boolean",group:"Misc",defaultValue:true},"bounce":{type:"boolean",group:"Behavior",defaultValue:null}},defaultAggregation:"content",aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"},"customHeader":{type:"sap.ui.core.Control",multiple:false},"subHeader":{type:"sap.ui.core.Control",multiple:false},"footer":{type:"sap.ui.core.Control",multiple:false},"_internalHeader":{type:"sap.m.Bar",multiple:false,visibility:"hidden"},"beginButton":{type:"sap.ui.core.Control",multiple:false},"endButton":{type:"sap.ui.core.Control",multiple:false}},associations:{"leftButton":{type:"sap.m.Button",multiple:false,deprecated:true},"rightButton":{type:"sap.m.Button",multiple:false,deprecated:true},"initialFocus":{type:"sap.ui.core.Control",multiple:false}},events:{"afterOpen":{},"afterClose":{},"beforeOpen":{},"beforeClose":{}}}});sap.m.Popover.M_EVENTS={'afterOpen':'afterOpen','afterClose':'afterClose','beforeOpen':'beforeOpen','beforeClose':'beforeClose'};jQuery.sap.require("sap.ui.core.Popup");jQuery.sap.require("sap.m.Bar");jQuery.sap.require("sap.m.Button");jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");jQuery.sap.require("sap.m.InstanceManager");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.m.Popover._bIE9=(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10);sap.m.Popover._bIOS7=sap.ui.Device.os.ios&&sap.ui.Device.os.version>=7&&sap.ui.Device.os.version<8&&sap.ui.Device.browser.name==="sf";
sap.m.Popover.prototype.init=function(){this._arrowOffsetThreshold=4;this._marginTopInit=false;this._marginTop=48;this._marginLeft=10;this._marginRight=10;this._marginBottom=10;this._$window=jQuery(window);this.oPopup=new sap.ui.core.Popup();this.oPopup.setShadow(true);this.oPopup.setAutoClose(true);this.oPopup.setAnimations(jQuery.proxy(this._openAnimation,this),jQuery.proxy(this._closeAnimation,this));this._placements=[sap.m.PlacementType.Top,sap.m.PlacementType.Right,sap.m.PlacementType.Bottom,sap.m.PlacementType.Left,sap.m.PlacementType.Vertical,sap.m.PlacementType.Horizontal,sap.m.PlacementType.Auto];this._myPositions=["center bottom","begin center","center top","end center"];this._atPositions=["center top","end center","center bottom","begin center"];this._offsets=["0 -18","18 0","0 18","-18 0"];this._arrowOffset=18;this._followOfTolerance=32;this._scrollContentList=[sap.m.NavContainer,sap.m.Page,sap.m.ScrollContainer];this._fnSetArrowPosition=jQuery.proxy(this._setArrowPosition,this);this._fnOrientationChange=jQuery.proxy(this._onOrientationChange,this);this._fnFollowOf=jQuery.proxy(function(i){var l=i.lastOfRect,r=i.currentOfRect;if(!sap.ui.Device.system.desktop||(Math.abs(l.top-r.top)<=this._followOfTolerance&&Math.abs(l.left-r.left)<=this._followOfTolerance)){this.oPopup._applyPosition(this.oPopup._oLastPosition)}else{this.close()}},this);this.setFollowOf(true);this._oRestoreFocusDelegate={onBeforeRendering:function(){var a=jQuery(document.activeElement),A=a.control(0);this._sFocusControlId=A&&A.getId()},onAfterRendering:function(){if(this._sFocusControlId&&!jQuery.sap.containsOrEquals(this.getDomRef(),document.activeElement)){sap.ui.getCore().byId(this._sFocusControlId).focus()}}};var t=this;this.oPopup._applyPosition=function(p,f){var e=this.getOpenState();if(e===sap.ui.core.OpenState.CLOSING||e===sap.ui.core.OpenState.CLOSED){return}if(!t._bCalSize){t._bCalSize=true;t._storeScrollPosition();t._clearCSSStyles()}var P=jQuery.inArray(t.getPlacement(),t._placements);if(P>3&&!t._bPosCalced){t._calcPlacement();return}if(t._oOpenBy instanceof sap.ui.core.Element){p.of=t._getOpenByDomRef()}if(!p.of||!jQuery.sap.containsOrEquals(document.documentElement,p.of)){jQuery.sap.log.warning("sap.m.Popover: in function applyPosition, the openBy element doesn't have any DOM output or the DOM is already detached from DOM tree"+t);return}var r=jQuery(p.of).rect();if(f&&(r.top+r.height<=0||r.top>=t._$window.height()||r.left+r.width<=0||r.left>=t._$window.width())){t.close();return}jQuery(window).scrollLeft(0);t._deregisterContentResizeHandler();sap.ui.core.Popup.prototype._applyPosition.call(this,p);t._fnSetArrowPosition();t._restoreScrollPosition();t._bCalSize=false;t._bPosCalced=false;t._registerContentResizeHandler()};this.oPopup.close=function(b){if(!b){t.fireBeforeClose({openBy:t._oOpenBy})}t._deregisterContentResizeHandler();sap.ui.core.Popup.prototype.close.apply(this,Array.prototype.slice.call(arguments,1));t.removeDelegate(t._oRestoreFocusDelegate)}};
sap.m.Popover.prototype.onBeforeRendering=function(){var n,p;if(!this._bVScrollingEnabled&&!this._bHScrollingEnabled&&this._hasSingleScrollableContent()){this._forceDisableScrolling=true;jQuery.sap.log.info("VerticalScrolling and horizontalScrolling in sap.m.Popover with ID "+this.getId()+" has been disabled because there's scrollable content inside")}else{this._forceDisableScrolling=false}if(!this._forceDisableScrolling){if(!this._oScroller){this._oScroller=new sap.ui.core.delegate.ScrollEnablement(this,this.getId()+"-scroll",{horizontal:this.getHorizontalScrolling(),vertical:this.getVerticalScrolling(),zynga:false,preventDefault:false,nonTouchScrolling:"scrollbar",bounce:this.getBounce()===""?undefined:this.getBounce()})}}if(this._bContentChanged){this._bContentChanged=false;n=this._getSingleNavContent();p=this._getSinglePageContent();if(n&&!this.getModal()&&!sap.ui.Device.support.touch&&!jQuery.sap.simulateMobileOnDesktop){n.attachEvent("afterNavigate",function(e){jQuery.sap.focus(this.getDomRef())},this)}if(n||p){p=p||n.getCurrentPage();if(p._getAnyHeader){this.addStyleClass("sapMPopoverWithHeaderCont")}if(n){n.attachEvent("navigate",function(e){var P=e.getParameter("to");if(P instanceof sap.m.Page){this.$().toggleClass("sapMPopoverWithHeaderCont",P._getAnyHeader())}},this)}}}};
sap.m.Popover.prototype.onAfterRendering=function(){var $,a,b;if(!this._marginTopInit){this._marginTop=2;if(this._oOpenBy){$=jQuery(this._getOpenByDomRef());if(!($.closest("header.sapMIBar").length>0)){a=$.closest(".sapMPage");if(a.length>0){b=a.children("header.sapMIBar");if(b.length>0){this._marginTop+=b.outerHeight()}}}this._marginTopInit=true}}};
sap.m.Popover.prototype.exit=function(){this._deregisterContentResizeHandler();sap.ui.Device.resize.detachHandler(this._fnOrientationChange);sap.m.InstanceManager.removePopoverInstance(this);this.removeDelegate(this._oRestoreFocusDelegate);this._oRestoreFocusDelegate=null;if(this.oPopup){this.oPopup.detachClosed(this._handleClosed,this);this.oPopup.destroy();this.oPopup=null}if(this._oScroller){this._oScroller.destroy();this._oScroller=null}if(this._internalHeader){this._internalHeader.destroy();this._internalHeader=null}if(this._headerTitle){this._headerTitle.destroy();this._headerTitle=null}};
sap.m.Popover.prototype.openBy=function(c,s){var p=this.oPopup,e=this.oPopup.getOpenState(),f=this._getInitialFocusId(),P,i;if(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING){if(this._oOpenBy===c){return this}else{var a=function(){p.detachClosed(a,this);this.openBy(c)};p.attachClosed(a,this);this.close();return this}}if(!c){return this}if(sap.ui.Device.support.touch){sap.ui.Device.resize.attachHandler(this._fnOrientationChange)}if(!this._oOpenBy||c!==this._oOpenBy){this._oOpenBy=c}this.fireBeforeOpen({openBy:this._oOpenBy});p.attachOpened(this._handleOpened,this);p.attachClosed(this._handleClosed,this);p.setInitialFocusId(f);i=jQuery.inArray(this.getPlacement(),this._placements);if(i>-1){P=this._getOpenByDomRef();if(!P){jQuery.sap.log.error("sap.m.Popover id = "+this.getId()+": is opened by a control which isn't rendered yet.");return this}this.toggleStyleClass("sapUiSizeCompact",!!jQuery(P).closest(".sapUiSizeCompact").length);p.setAutoCloseAreas([P]);p.setContent(this);if(i<=3){p.setPosition(this._myPositions[i],this._atPositions[i],P,this._calcOffset(this._offsets[i]),"fit")}var t=this;var C=function(){if(p.getOpenState()===sap.ui.core.OpenState.CLOSING){if(t._sOpenTimeout){clearTimeout(t._sOpenTimeout);t._sOpenTimeout=null}t._sOpenTimeout=setTimeout(C,150)}else{t._oPreviousFocus=sap.ui.core.Popup.getCurrentFocusInfo();p.open();t.addDelegate(t._oRestoreFocusDelegate,t);if(!s){sap.m.InstanceManager.addPopoverInstance(t)}}};C()}else{jQuery.sap.log.error(this.getPlacement()+"is not a valid value! It can only be top, right, bottom or left")}return this};
sap.m.Popover.prototype.close=function(){var e=this.oPopup.getOpenState(),s;if(e===sap.ui.core.OpenState.CLOSED||e===sap.ui.core.OpenState.CLOSING){return this}this.fireBeforeClose({openBy:this._oOpenBy});this.oPopup.close(true);if(this._oPreviousFocus){s=(this._oPreviousFocus.sFocusId===sap.ui.getCore().getCurrentFocusedControlId())||(this._oPreviousFocus.sFocusId===document.activeElement.id);if(!s&&this.oPopup.restoreFocus){sap.ui.core.Popup.applyFocusInfo(this._oPreviousFocus);this._oPreviousFocus=null}}return this};
sap.m.Popover.prototype.isOpen=function(){return this.oPopup&&this.oPopup.isOpen()};
sap.m.Popover.prototype.setFollowOf=function(v){if(v){this.oPopup.setFollowOf(this._fnFollowOf)}else{this.oPopup.setFollowOf(false)}return this};
sap.m.Popover.prototype._clearCSSStyles=function(){var s=this.getDomRef().style,$=this.$("cont"),a=$.children(".sapMPopoverScroll"),c=$[0].style,S=a.css("position")==="absolute",C=this.getContentWidth(),b=this.getContentHeight(),d=this.$("arrow"),w=this._$window.width(),W=this._$window.height();s.overflow="";if(C.indexOf("%")>0){C=sap.m.PopupHelper.calcPercentageSize(C,w)}if(b.indexOf("%")>0){b=sap.m.PopupHelper.calcPercentageSize(b,W)}c.width=C||(S?a.outerWidth(true)+"px":"");c.height=b||(S?a.outerHeight(true)+"px":"");c.maxWidth="";c.maxHeight="";s.left="";s.right="";s.top="";s.bottom="";s.width="";s.height="";a[0].style.width="";d.removeClass("sapMPopoverArrRight sapMPopoverArrLeft sapMPopoverArrDown sapMPopoverArrUp sapMPopoverCrossArr sapMPopoverFooterAlignArr sapMPopoverHeaderAlignArr");d.css({left:"",top:""})};
sap.m.Popover.prototype._onOrientationChange=function(){if(this._bCalSize){return}var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING)){return}this.oPopup._applyPosition(this.oPopup._oLastPosition,true)};
sap.m.Popover.prototype._handleOpened=function(){var t=this;this.oPopup.detachOpened(this._handleOpened,this);if(!sap.ui.Device.support.touch){setTimeout(function(){sap.ui.Device.resize.attachHandler(t._fnOrientationChange)},0)}this.fireAfterOpen({openBy:this._oOpenBy})};
sap.m.Popover.prototype._handleClosed=function(){this.oPopup.detachClosed(this._handleClosed,this);sap.ui.Device.resize.detachHandler(this._fnOrientationChange);sap.m.InstanceManager.removePopoverInstance(this);this.fireAfterClose({openBy:this._oOpenBy})};
sap.m.Popover.prototype.onfocusin=function(e){var s=e.target,$=this.$();if(s.id===this.getId()+"-firstfe"){var l=$.lastFocusableDomRef();jQuery.sap.focus(l)}else if(s.id===this.getId()+"-lastfe"){var f=$.firstFocusableDomRef();jQuery.sap.focus(f)}};
sap.m.Popover.prototype.onkeydown=function(e){var k=jQuery.sap.KeyCodes,K=e.which||e.keyCode,a=e.altKey;if(K===k.ESCAPE||(a&&K===k.F4)){if(e.originalEvent&&e.originalEvent._sapui_handledByControl){return}this.close();e.stopPropagation();e.preventDefault()}};
sap.m.Popover.prototype._hasSingleNavContent=function(){return!!this._getSingleNavContent()};
sap.m.Popover.prototype._getSingleNavContent=function(){var c=this.getContent();while(c.length===1&&c[0]instanceof sap.ui.core.mvc.View){c=c[0].getContent()}if(c.length===1&&c[0]instanceof sap.m.NavContainer){return c[0]}else{return null}};
sap.m.Popover.prototype._getSinglePageContent=function(){var c=this.getContent();while(c.length===1&&c[0]instanceof sap.ui.core.mvc.View){c=c[0].getContent()}if(c.length===1&&c[0]instanceof sap.m.Page){return c[0]}else{return null}};
sap.m.Popover.prototype._hasSinglePageContent=function(){var c=this.getContent();while(c.length===1&&c[0]instanceof sap.ui.core.mvc.View){c=c[0].getContent()}if(c.length===1&&c[0]instanceof sap.m.Page){return true}else{return false}};
sap.m.Popover.prototype._hasSingleScrollableContent=function(){var c=this.getContent(),i;while(c.length===1&&c[0]instanceof sap.ui.core.mvc.View){c=c[0].getContent()}if(c.length===1){for(i=0;i<this._scrollContentList.length;i++){if(c[0]instanceof this._scrollContentList[i]){return true}}return false}else{return false}};
sap.m.Popover.prototype._getOffsetX=function(){var r=sap.ui.getCore().getConfiguration().getRTL();return this.getOffsetX()*(r?-1:1)};
sap.m.Popover.prototype._getOffsetY=function(){return this.getOffsetY()};
sap.m.Popover.prototype._calcOffset=function(o){var O=this._getOffsetX(),i=this._getOffsetY();var p=o.split(" ");return(parseInt(p[0],10)+O)+" "+(parseInt(p[1],10)+i)};
sap.m.Popover.prototype._calcPlacement=function(){var p=this.getPlacement();var P=this._getOpenByDomRef();switch(p){case sap.m.PlacementType.Auto:this._calcAuto();break;case sap.m.PlacementType.Vertical:this._calcVertical();break;case sap.m.PlacementType.Horizontal:this._calcHorizontal();break}this._bPosCalced=true;var i=jQuery.inArray(this._oCalcedPos,this._placements);this.oPopup.setPosition(this._myPositions[i],this._atPositions[i],P,this._calcOffset(this._offsets[i]),"fit")};
sap.m.Popover.prototype._calcVertical=function(){var $=jQuery(this._getOpenByDomRef());var o=this._getOffsetY();var t=$.offset().top-this._marginTop+o;var p=$.offset().top+$.outerHeight();var b=this._$window.height()-p-this._marginBottom-o;if(t>b){this._oCalcedPos=sap.m.PlacementType.Top}else{this._oCalcedPos=sap.m.PlacementType.Bottom}};
sap.m.Popover.prototype._calcHorizontal=function(){var $=jQuery(this._getOpenByDomRef());var o=this._getOffsetX();var l=$.offset().left-this._marginLeft+o;var p=$.offset().left+$.outerWidth();var r=this._$window.width()-p-this._marginRight-o;var R=sap.ui.getCore().getConfiguration().getRTL();if(l>r){R?(this._oCalcedPos=sap.m.PlacementType.Right):(this._oCalcedPos=sap.m.PlacementType.Left)}else{R?(this._oCalcedPos=sap.m.PlacementType.Left):(this._oCalcedPos=sap.m.PlacementType.Right)}};
sap.m.Popover.prototype._calcAuto=function(){if(this._$window.width()>this._$window.height()){if(this._checkHorizontal()){this._calcHorizontal()}else if(this._checkVertical()){this._calcVertical()}else{this._calcBestPos()}}else{if(this._checkVertical()){this._calcVertical()}else if(this._checkHorizontal()){this._calcHorizontal()}else{this._calcBestPos()}}};
sap.m.Popover.prototype._checkHorizontal=function(){var $=jQuery(this._getOpenByDomRef());var o=this._getOffsetX();var l=$.offset().left-this._marginLeft+o;var p=$.offset().left+$.outerWidth();var r=this._$window.width()-p-this._marginRight-o;var a=this.$();var w=a.outerWidth()+this._arrowOffset;if((w<=l)||(w<=r)){return true}};
sap.m.Popover.prototype._checkVertical=function(){var $=jQuery(this._getOpenByDomRef());var o=this._getOffsetY();var t=$.offset().top-this._marginTop+o;var p=$.offset().top+$.outerHeight();var b=this._$window.height()-p-this._marginBottom-o;var a=this.$();var h=a.outerHeight()+this._arrowOffset;if((h<=t)||(h<=b)){return true}};
sap.m.Popover.prototype._calcBestPos=function(){var $=this.$();var h=$.outerHeight();var w=$.outerWidth();var a=jQuery(this._getOpenByDomRef());var o=this._getOffsetX();var O=this._getOffsetY();var t=a.offset().top-this._marginTop+O;var p=a.offset().top+a.outerHeight();var b=this._$window.height()-p-this._marginBottom-O;var l=a.offset().left-this._marginLeft+o;var P=a.offset().left+a.outerWidth();var r=this._$window.width()-P-this._marginRight-o;var f=h*w;var A;var c;if((this._$window.height()-this._marginTop-this._marginBottom)>=h){A=h}else{A=this._$window.height()-this._marginTop-this._marginBottom}if((this._$window.width()-this._marginLeft-this._marginRight)>=w){c=w}else{c=this._$window.width()-this._marginLeft-this._marginRight}var L=(A*(l))/f;var R=(A*(r))/f;var T=(c*(t))/f;var B=(c*(b))/f;var m=Math.max(L,R);var M=Math.max(T,B);if(m>M){if(m===L){this._oCalcedPos=sap.m.PlacementType.Left}else if(m===R){this._oCalcedPos=sap.m.PlacementType.Right}}else if(M>m){if(M===T){this._oCalcedPos=sap.m.PlacementType.Top}else if(M===B){this._oCalcedPos=sap.m.PlacementType.Bottom}}else if(M===m){if(this._$window.height()>this._$window.width()){if(M===T){this._oCalcedPos=sap.m.PlacementType.Top}else if(M===B){this._oCalcedPos=sap.m.PlacementType.Bottom}}else{if(m===L){this._oCalcedPos=sap.m.PlacementType.Left}else if(m===R){this._oCalcedPos=sap.m.PlacementType.Right}}}};
sap.m.Popover.width=function(e){if(sap.ui.Device.browser.msie){var w=window.getComputedStyle(e,null).getPropertyValue("width");return Math.ceil(parseFloat(w))}else{return jQuery(e).width()}};
sap.m.Popover.outerWidth=function(e,i){var w=sap.m.Popover.width(e),p=parseInt(jQuery(e).css("padding-left"),10),P=parseInt(jQuery(e).css("padding-right"),10),b=parseInt(jQuery(e).css("border-left-width"),10),B=parseInt(jQuery(e).css("border-right-width"),10);var o=w+p+P+b+B;if(i){var m=parseInt(jQuery(e).css("margin-left"),10),M=parseInt(jQuery(e).css("margin-right"),10);o=o+m+M}return o};
sap.m.Popover.prototype._setArrowPosition=function(){var p=sap.m.Popover;var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING)){return}var $=jQuery(this._getOpenByDomRef()),a=this.$(),P=window.parseInt(a.css("border-left-width"),10),i=window.parseInt(a.css("border-right-width"),10),b=window.parseInt(a.css("border-top-width"),10),c=window.parseInt(a.css("border-bottom-width"),10),d=window.parseInt(a.css("top"),10),f=window.parseInt(a.css("left"),10),s=this._oCalcedPos||this.getPlacement(),g=this.$("arrow"),A=g.outerHeight(true),h=a.offset(),o=this._getOffsetX(),O=this._getOffsetY(),w=p.outerWidth(a[0]),H=a.outerHeight(),j=this.$("cont"),k=j.children(".sapMPopoverScroll"),S=k.css("position")==="absolute",C=window.parseInt(j.css("margin-left"),10),l=window.parseInt(j.css("margin-right"),10),m=a.children(".sapMPopoverHeader"),n=a.children(".sapMPopoverSubHeader"),q=a.children(".sapMPopoverFooter"),M,r,t,F,u={},v,x=0,y=0,z=0;if(m.length>0){x=m.outerHeight(true)}if(n.length>0){y=n.outerHeight(true)}if(q.length>0){z=q.outerHeight(true)}var W=this._$window.scrollLeft(),B=this._$window.scrollTop(),D=this._$window.width(),E=(p._bIOS7&&sap.ui.Device.orientation.landscape&&window.innerHeight)?window.innerHeight:this._$window.height(),G=W+D,I=B+E;var J=W+this._marginLeft,K=this._marginRight,L=B+this._marginTop,N=this._marginBottom;var R=sap.ui.getCore().getConfiguration().getRTL();var Q,T,U,V;switch(s){case sap.m.PlacementType.Left:if(R){J=$.offset().left+p.outerWidth($[0],false)+this._arrowOffset+o}else{K=G-$.offset().left+this._arrowOffset-o}break;case sap.m.PlacementType.Right:if(R){K=G-$.offset().left+this._arrowOffset-o}else{J=$.offset().left+p.outerWidth($[0],false)+this._arrowOffset+o}break;case sap.m.PlacementType.Top:N=I-$.offset().top+this._arrowOffset-O;break;case sap.m.PlacementType.Bottom:L=$.offset().top+$.outerHeight()+this._arrowOffset+O;break}var X=G-h.left-w,Y=I-h.top-H,Z=(G-K-J)<w,_=(I-L-N)<H,a1=h.left<J,b1=X<K,c1=h.top<L,d1=Y<N;if(Z){Q=J;T=K}else{if(a1){Q=J;if(R){T=parseInt(a.css("right"),10)-(Q-h.left);if(T<K){T=K}}}else if(b1){T=K;if(f-K+X>J){Q=f-K+X}}}if(_){U=L;V=N}else{if(c1){U=L}else if(d1){V=N;if(d-N+Y>L){U=d-N+Y}}}a.css({top:U,bottom:V-B,left:Q,right:T-W});w=p.outerWidth(a[0]);H=a.outerHeight();if(s===(R?sap.m.PlacementType.Right:sap.m.PlacementType.Left)){r=a.offset().left+w-this._marginLeft}else{r=G-a.offset().left-this._marginRight}r-=(P+i);if(S){r-=(C+l)}M=a.height()-x-y-z-parseInt(j.css("margin-top"),10)-parseInt(j.css("margin-bottom"),10);M=Math.max(M,0);u["max-width"]=r+"px";if(this.getContentHeight()||S||(j.height()>M)){u["height"]=Math.min(M,j.height())+"px"}else{u["height"]="";u["max-height"]=M+"px"}j.css(u);if(p.outerWidth(k[0],true)<=p.width(j[0])){k.css("display","block")}if(s===sap.m.PlacementType.Left||s===sap.m.PlacementType.Right){v=$.offset().top-a.offset().top-b+O+0.5*($.outerHeight(false)-g.outerHeight(false));v=Math.max(v,this._arrowOffsetThreshold);v=Math.min(v,H-this._arrowOffsetThreshold-g.outerHeight());g.css("top",v)}else if(s===sap.m.PlacementType.Top||s===sap.m.PlacementType.Bottom){if(R){v=a.offset().left+p.outerWidth(a[0],false)-($.offset().left+p.outerWidth($[0],false))+i+o+0.5*(p.outerWidth($[0],false)-p.outerWidth(g[0],false));v=Math.max(v,this._arrowOffsetThreshold);v=Math.min(v,w-this._arrowOffsetThreshold-p.outerWidth(g[0],false));g.css("right",v)}else{v=$.offset().left-a.offset().left-P+o+0.5*(p.outerWidth($[0],false)-p.outerWidth(g[0],false));v=Math.max(v,this._arrowOffsetThreshold);v=Math.min(v,w-this._arrowOffsetThreshold-p.outerWidth(g[0],false));g.css("left",v)}}switch(s){case sap.m.PlacementType.Left:g.addClass("sapMPopoverArrRight");break;case sap.m.PlacementType.Right:g.addClass("sapMPopoverArrLeft");break;case sap.m.PlacementType.Top:g.addClass("sapMPopoverArrDown");break;case sap.m.PlacementType.Bottom:g.addClass("sapMPopoverArrUp");break}t=g.position();F=q.position();if(s===sap.m.PlacementType.Left||s===sap.m.PlacementType.Right){if((t.top+A)<(x+y)){g.addClass("sapMPopoverHeaderAlignArr")}else if((t.top<(x+y))||(q.length&&((t.top+A)>F.top)&&(t.top<F.top))){g.addClass("sapMPopoverCrossArr")}else if(q.length&&(t.top>F.top)){g.addClass("sapMPopoverFooterAlignArr")}}a.css("overflow","visible")};
sap.m.Popover.prototype._isPopupElement=function(d){var p=this._getOpenByDomRef();return!!(jQuery(d).closest(sap.ui.getCore().getStaticAreaRef()).length)||!!(jQuery(d).closest(p).length)};
sap.m.Popover.prototype._getAnyHeader=function(){if(this.getCustomHeader()){return this.getCustomHeader()}else{if(this.getShowHeader()){this._createInternalHeader();return this._internalHeader}}};
sap.m.Popover.prototype._createInternalHeader=function(){if(!this._internalHeader){var t=this;this._internalHeader=new sap.m.Bar(this.getId()+"-intHeader");this.setAggregation("_internalHeader",this._internalHeader);this._internalHeader.addEventDelegate({onAfterRendering:function(){t._restoreFocus()}});return true}else{return false}};
sap.m.Popover.prototype._openAnimation=function(r,R,o){var t=this;if(sap.m.Popover._bIE9||(sap.ui.Device.os.android&&sap.ui.Device.os.version<2.4)){o()}else{var O=false,T=function(){if(O||!t.oPopup||t.oPopup.getOpenState()!==sap.ui.core.OpenState.OPENING){return}r.unbind("webkitTransitionEnd transitionend");o();O=true};setTimeout(function(){r.addClass("sapMPopoverTransparent");r.css("display","block");setTimeout(function(){r.bind("webkitTransitionEnd transitionend",T);r.removeClass("sapMPopoverTransparent");setTimeout(function(){T()},300)},sap.ui.Device.browser.firefox?50:0)},0)}};
sap.m.Popover.prototype._closeAnimation=function(r,R,c){var t=this;if(sap.m.Popover._bIE9||(sap.ui.Device.os.android&&sap.ui.Device.os.version<2.4)){c()}else{var C=false,T=function(){if(C){return}r.unbind("webkitTransitionEnd transitionend");setTimeout(function(){c();C=true;r.removeClass("sapMPopoverTransparent")},0)};r.bind("webkitTransitionEnd transitionend",T).addClass("sapMPopoverTransparent");setTimeout(function(){T()},300)}};
sap.m.Popover.prototype._getInitialFocusId=function(){var b=this.getBeginButton(),e=this.getEndButton();return this.getInitialFocus()||(b&&b.getVisible()&&b.getId())||(e&&e.getVisible()&&e.getId())||this.getId()};
sap.m.Popover.prototype._restoreFocus=function(){if(this.isOpen()){var f=this._getInitialFocusId(),c=sap.ui.getCore().byId(f);jQuery.sap.focus(c?c.getFocusDomRef():jQuery.sap.domById(f))}};
sap.m.Popover.prototype._registerContentResizeHandler=function(){if(!this._sResizeListenerId){this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef("scroll"),this._fnOrientationChange)}};
sap.m.Popover.prototype._deregisterContentResizeHandler=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}};
sap.m.Popover.prototype._storeScrollPosition=function(){var $=this.$("cont");if($.length>0){this._oScrollPosDesktop={x:$.scrollLeft(),y:$.scrollTop()}}};
sap.m.Popover.prototype._restoreScrollPosition=function(){if(!this._oScrollPosDesktop){return}var $=this.$("cont");if($.length>0){$.scrollLeft(this._oScrollPosDesktop.x).scrollTop(this._oScrollPosDesktop.y);this._oScrollPosDesktop=null}};
sap.m.Popover.prototype._repositionOffset=function(){var e=this.oPopup.getOpenState(),l,p;if(!(e===sap.ui.core.OpenState.OPEN)){return this}l=this.oPopup._oLastPosition;p=jQuery.inArray(this.getPlacement(),this._placements);if(p===-1){return this}if(p<4){l.offset=this._calcOffset(this._offsets[p]);this.oPopup._applyPosition(l)}else{this._calcPlacement()}return this};
sap.m.Popover.prototype._getOpenByDomRef=function(){if(!this._oOpenBy){return null}if(this._oOpenBy instanceof sap.ui.core.Element){return(this._oOpenBy.getPopupAnchorDomRef&&this._oOpenBy.getPopupAnchorDomRef())||this._oOpenBy.getFocusDomRef()}else{return this._oOpenBy}};
sap.m.Popover.prototype.setPlacement=function(p){this.setProperty("placement",p,true);var P=jQuery.inArray(p,this._placements);if(P<=3){this._oCalcedPos=p}return this};
sap.m.Popover.prototype.setTitle=function(t){if(t){this.setProperty("title",t,true);if(this._headerTitle){this._headerTitle.setText(t)}else{this._headerTitle=new sap.m.Label(this.getId()+"-title",{text:this.getTitle()});this._createInternalHeader();this._internalHeader.addContentMiddle(this._headerTitle)}}return this};
sap.m.Popover.prototype.setBeginButton=function(b){var o=this.getBeginButton();if(o===b){return this}this._createInternalHeader();this._beginButton=b;if(b){b.setType(sap.m.ButtonType.Transparent);if(o){this._internalHeader.removeAggregation("contentLeft",o,true)}this._internalHeader.addAggregation("contentLeft",b)}else{this._internalHeader.removeContentLeft(o)}return this};
sap.m.Popover.prototype.setEndButton=function(b){var o=this.getEndButton();if(o===b){return this}this._createInternalHeader();this._endButton=b;if(b){b.setType(sap.m.ButtonType.Transparent);if(o){this._internalHeader.removeAggregation("contentRight",o,true)}this._internalHeader.insertAggregation("contentRight",b,1,true);this._internalHeader.invalidate()}else{this._internalHeader.removeContentRight(o)}return this};
sap.m.Popover.prototype.setLeftButton=function(b){if(!(b instanceof sap.m.Button)){b=sap.ui.getCore().byId(b)}this.setBeginButton(b);return this.setAssociation("leftButton",b)};
sap.m.Popover.prototype.setRightButton=function(b){if(!(b instanceof sap.m.Button)){b=sap.ui.getCore().byId(b)}this.setEndButton(b);return this.setAssociation("rightButton",b)};
sap.m.Popover.prototype.setShowHeader=function(v){if(v===this.getShowHeader()||this.getCustomHeader()){return this}if(v){if(this._internalHeader){this._internalHeader.$().show()}}else{if(this._internalHeader){this._internalHeader.$().hide()}}this.setProperty("showHeader",v,true);return this};
sap.m.Popover.prototype.setModal=function(m,M){if(m===this.getModal()){return this}this.oPopup.setModal(m,jQuery.trim("sapMPopoverBLayer "+M||""));this.setProperty("modal",m,true);return this};
sap.m.Popover.prototype.setOffsetX=function(v){this.setProperty("offsetX",v,true);return this._repositionOffset()};
sap.m.Popover.prototype.setOffsetY=function(v){this.setProperty("offsetY",v,true);return this._repositionOffset()};
sap.m.Popover.prototype.setEnableScrolling=function(v){this.setHorizontalScrolling(v);this.setVerticalScrolling(v);var o=this.getEnableScrolling();if(o===v){return this}this.setProperty("enableScrolling",v,true);return this};
sap.m.Popover.prototype.setVerticalScrolling=function(v){this._bVScrollingEnabled=v;var o=this.getVerticalScrolling();if(o===v){return this}this.$().toggleClass("sapMPopoverVerScrollDisabled",!v);this.setProperty("verticalScrolling",v,true);if(this._oScroller){this._oScroller.setVertical(v)}return this};
sap.m.Popover.prototype.setHorizontalScrolling=function(v){this._bHScrollingEnabled=v;var o=this.getHorizontalScrolling();if(o===v){return this}this.$().toggleClass("sapMPopoverHorScrollDisabled",!v);this.setProperty("horizontalScrolling",v,true);if(this._oScroller){this._oScroller.setHorizontal(v)}return this};
sap.m.Popover.prototype.getScrollDelegate=function(){return this._oScroller};
sap.m.Popover.prototype.setAggregation=function(a,o,s){if(a==="beginButton"||a==="endButton"){var f="set"+a.charAt(0).toUpperCase()+a.slice(1);return this[f](o)}else{return sap.ui.core.Control.prototype.setAggregation.apply(this,arguments)}};
sap.m.Popover.prototype.getAggregation=function(a,d){if(a==="beginButton"||a==="endButton"){var b=this["_"+a];return b||d||null}else{return sap.ui.core.Control.prototype.getAggregation.apply(this,arguments)}};
sap.m.Popover.prototype.destroyAggregation=function(a,s){if(a==="beginButton"||a==="endButton"){var b=this["_"+a];if(b){b.destroy();this["_"+a]=null}return this}else{return sap.ui.core.Control.prototype.destroyAggregation.apply(this,arguments)}};
sap.m.Popover.prototype.invalidate=function(o){if(this.isOpen()){sap.ui.core.Control.prototype.invalidate.apply(this,arguments)}return this};
sap.m.Popover.prototype.addAggregation=function(a,o,s){if(a==="content"){this._bContentChanged=true}sap.ui.core.Control.prototype.addAggregation.apply(this,arguments)};
