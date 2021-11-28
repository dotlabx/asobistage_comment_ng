// ==UserScript==
// @name         ASOBISTAGE comment NG
// @version      1.0.1
// @description  ASOBISTAGEプレイヤーのユーザー・コメントNG機能
// @author       dotlab
// @match        https://asobistage.asobistore.jp/event/*
// @updateURL    https://github.com/dotlabx/asobistage_comment_ng/raw/main/asobistage_comment_ng.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  var del = false; // コメント欄から完全に消す場合はtrue

  var NG = [
    // ここに固定でNGにしたいワードを追加
    "NGにしたいユーザー名かワード1",
    "NGにしたいユーザー名かワード2",
  ];

  var includesNG = function (x) {
    for (var i = 0; i < NG.length; i++) {
      if (NG[i] !== '' && x.indexOf(NG[i]) >= 0) {
        return true;
      }
    }
    return false;
  };

  var checkComment = function () {
    document.querySelectorAll('[class^="commentViewer_item"][data-official="false"]').forEach(function (item) {
      item.querySelectorAll('[class^="commentViewer_item_nickName"]').forEach(function (x) {
        if (includesNG(x.innerText)) {
          if (del) {
            x.parentNode.parentNode.parentNode.style.display = 'none';
          } else {
            x.innerText = 'censored';
            x.parentNode.querySelectorAll('[class^="commentViewer_item_comment"] span').forEach(function (y) {
              y.innerText = 'censored';
            })
          }
        }
      });
      item.querySelectorAll('[class^="commentViewer_item_comment"] span').forEach(function (x) {
        if (includesNG(x.innerText)) {
          if (del) {
            x.parentNode.style.display = 'none';
          } else {
            x.innerText = 'censored';
          }
        }
      });
    });
  };

  var addng = function () {
    var s = window.prompt('NGにしたいユーザー名かコメントの一部を入力');
    if (s !== null) {
      NG.push(s);
      checkComment();
    }
  };

  new MutationObserver(function () {
    if (document.querySelector('.btn-comment-ng') === null) {
      var tab = document.querySelector('[class^="commentViewer_commentViewer_tab_item"]');
      if (tab !== null) {
        var btn = document.createElement("button");
        btn.className = 'btn-comment-ng';
        btn.innerText = 'NG追加';
        btn.onclick = addng;
        tab.appendChild(btn);
      }
    } else {
        checkComment();
    }
  }).observe(document.querySelector('body'), { childList: true, subtree: true });
})();
