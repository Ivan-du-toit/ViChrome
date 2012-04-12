(function() {
  var escChars, g, initCheckBox, initDropDown, initInputNumber, initInputText, makePluginItem, onSettings, refreshPluginList, setSetting, settings, updateKeyMappingList, updatePlugin;

  if (this.vichrome == null) this.vichrome = {};

  g = this.vichrome;

  settings = null;

  setSetting = function(name, val, response) {
    return chrome.extension.sendRequest({
      command: "Settings",
      type: "set",
      name: name,
      value: val
    });
  };

  escChars = function(str) {
    return str.replace("<", "&lt;").replace(">", "&gt;").replace(" ", "&nbsp;");
  };

  updateKeyMappingList = function() {
    var com, curMap, key, map, url, _ref, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results;
    curMap = $('#keyMappingList');
    curMap.append($('<div />').html('<h3>Normal Mode Mapping (nmap)</h3>'));
    _ref = settings.keyMappingNormal;
    for (key in _ref) {
      com = _ref[key];
      curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
    }
    curMap.append($('<div />').html('<h3>Insert Mode Mapping (imap)</h3>'));
    _ref2 = settings.keyMappingInsert;
    for (key in _ref2) {
      com = _ref2[key];
      curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
    }
    curMap.append($('<div />').html('<h3>Search/Command Mode Mapping (cmap)</h3>'));
    _ref3 = settings.keyMappingCommand;
    for (key in _ref3) {
      com = _ref3[key];
      curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
    }
    curMap.append($('<div />').html('<h3>Emergency Mode Mapping (emap)</h3>'));
    _ref4 = settings.keyMappingEmergency;
    for (key in _ref4) {
      com = _ref4[key];
      curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
    }
    curMap.append($('<div />').html('<h3>Command Aliases (alias)</h3>'));
    _ref5 = settings.aliases;
    for (key in _ref5) {
      com = _ref5[key];
      curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
    }
    curMap.append($('<div />').html('<h2>PageCmd Mapping</h2>'));
    _ref6 = settings.pageMap;
    _results = [];
    for (url in _ref6) {
      map = _ref6[url];
      curMap.append($('<div />').html("<h3>" + url + "</h3>"));
      curMap.append($('<div />').html('<h3>Normal Mode Mapping</h3>'));
      _ref7 = map.nmap;
      for (key in _ref7) {
        com = _ref7[key];
        curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
      }
      curMap.append($('<div />').html('<h3>Insert Mode Mapping</h3>'));
      _ref8 = map.imap;
      for (key in _ref8) {
        com = _ref8[key];
        curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
      }
      curMap.append($('<div />').html('<h3>Search/Command Mode Mapping</h3>'));
      _ref9 = map.cmap;
      for (key in _ref9) {
        com = _ref9[key];
        curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
      }
      curMap.append($('<div />').html('<h3>Emergency Mode Mapping</h3>'));
      _ref10 = map.emap;
      for (key in _ref10) {
        com = _ref10[key];
        curMap.append($('<div />').html(escChars(key + " : " + escChars(com))));
      }
      curMap.append($('<div />').html('<h3>Command Aliases</h3>'));
      _results.push((function() {
        var _ref11, _results2;
        _ref11 = map.alias;
        _results2 = [];
        for (key in _ref11) {
          com = _ref11[key];
          _results2.push(curMap.append($('<div />').html(escChars(key + " : " + escChars(com)))));
        }
        return _results2;
      })());
    }
    return _results;
  };

  initInputText = function(name) {
    return $('#' + name).val(settings[name]).keyup(function() {
      return setSetting(name, $(this).val());
    });
  };

  initInputNumber = function(name) {
    return $('#' + name).val(settings[name]).keyup(function() {
      return setSetting(name, parseInt($(this).val()));
    }).click(function() {
      return setSetting(name, parseInt($(this).val()));
    }).mousewheel(function() {
      return setSetting(name, parseInt($(this).val()));
    });
  };

  initCheckBox = function(name) {
    return $('#' + name).attr('checked', settings[name]).change(function() {
      return setSetting(name, $(this).is(':checked'));
    });
  };

  initDropDown = function(name) {
    return $('#' + name).val(settings[name]).change(function() {
      return setSetting(name, $(this).val());
    });
  };

  onSettings = function(msg) {
    if (msg.name === "all") settings = msg.value;
    initInputNumber("scrollPixelCount");
    initInputNumber("commandWaitTimeOut");
    initInputNumber("minIncSearch");
    initInputNumber("commandBoxWidth");
    initInputNumber("minMigemoLength");
    initInputNumber("hintFontSize");
    initInputText("fModeAvailableKeys");
    initInputText("hintBackgroundColor");
    initInputText("hintColor");
    initInputText("hintColorSelected");
    initCheckBox("disableAutoFocus");
    initCheckBox("smoothScroll");
    initCheckBox("enableCompletion");
    initCheckBox("wrapSearch");
    initCheckBox("incSearch");
    initCheckBox("ignoreCase");
    initCheckBox("useMigemo");
    initCheckBox("fModeIgnoreCase");
    initCheckBox("notifyUpdateSucceeded");
    initCheckBox("useFModeAnimation");
    initDropDown("commandBoxAlign");
    initDropDown("searchEngine");
    $('[name="newTabPage"][value="' + settings.defaultNewTab + '"]').attr('checked', true);
    $('[name="newTabPage"]').change(function() {
      if ($(this).is(':checked')) {
        return setSetting("defaultNewTab", $(this).val());
      }
    });
    $('#ignoredUrls').val(settings.ignoredUrls.join('\n'));
    $('#ignoredUrlsButton').click(function() {
      return setSetting("ignoredUrls", $('#ignoredUrls').val().split('\n'));
    });
    $('#keyMapping').val(settings.keyMappingAndAliases);
    $('#keyMappingButton').click(function() {
      return setSetting("keyMappingAndAliases", $('#keyMapping').val());
    });
    return updateKeyMappingList();
  };

  $(document).ready(function() {
    chrome.extension.sendRequest({
      command: "Settings",
      type: "get",
      name: "all"
    }, onSettings);
    $('input#addNewPlugin').click(function() {
      var file, reader;
      file = $('input#chooseNewPlugin').get(0).files[0];
      if (file.name.search(/\.zip$/i) < 0) {
        alert('choose zip file');
        return;
      }
      reader = new FileReader;
      reader.onload = function(evt) {
        var background, contentScript, manifest, plugin, zip;
        console.log(evt);
        zip = new JSZip;
        zip.load(evt.target.result);
        manifest = JSON.parse(zip.file('manifest.json').asText());
        if (zip.file('contentscript.js') != null) {
          contentScript = zip.file('contentscript.js').asText();
        }
        if (zip.file('background.js') != null) {
          background = zip.file('background.js').asText();
        }
        plugin = {
          name: manifest.name,
          description: manifest.description,
          contentScript: contentScript,
          background: background,
          enabled: true
        };
        return chrome.extension.sendRequest({
          command: "UpdatePlugin",
          plugin: plugin
        }, function() {
          return refreshPluginList();
        });
      };
      return reader.readAsBinaryString(file);
    });
    return refreshPluginList();
  });

  refreshPluginList = function() {
    $('div#plugin-item').remove();
    return chrome.extension.sendRequest({
      command: "GetPlugins"
    }, function(plugins) {
      var elem, name, plugin;
      for (name in plugins) {
        plugin = plugins[name];
        elem = makePluginItem(plugin);
        if (!plugin.enabled) elem = elem.addClass('plugin-disabled');
        $('div#pluginsContainer').append(elem);
      }
    });
  };

  makePluginItem = function(plugin) {
    var checkBox, controllers, itemDescription, itemName, removeButton, topDiv;
    topDiv = $('<div id="plugin-item" />');
    itemName = $('<div id="plugin-item-name" />').html(plugin.name);
    itemDescription = $('<div id="plugin-item-description">').html(plugin.description);
    checkBox = $('<input type="checkbox" id="plugin-item-enabled-button" />').attr('checked', plugin.enabled).change(function() {
      var p;
      p = g.extend(plugin);
      p.enabled = checkBox.is(':checked');
      return updatePlugin(p);
    });
    removeButton = $('<input type="button" id="plugin-remove-button" value="Remove" />').click(function() {
      return chrome.extension.sendRequest({
        command: "RemovePlugin",
        name: plugin.name
      }, function() {
        return refreshPluginList();
      });
    });
    controllers = $('<div id="plugin-item-controllers" />').append(checkBox).append($('<span />').html('Enabled')).append(removeButton);
    return topDiv.append($('<div />').append(itemName).append(controllers)).append($('<div />').append(itemDescription));
  };

  updatePlugin = function(plugin) {
    return chrome.extension.sendRequest({
      command: "UpdatePlugin",
      plugin: plugin
    });
  };

  $(document).ready(function() {
    var page;
    $('#page-container > div').hide();
    page = /#.*$/.exec(window.location.href);
    if (page != null) {
      page = page[0];
    } else {
      page = '#general';
    }
    $("ul.navbar li:has(a[href=\"" + page + "\"])").addClass('navbar-item-selected').show();
    $(page).show();
    console.log(page);
    return $('ul.navbar li:not(.navbar-item-separator)').click(function() {
      var tab;
      $('ul.navbar li').removeClass('navbar-item-selected');
      $(this).addClass('navbar-item-selected');
      $('#page-container > div').hide();
      tab = $(this).find('a').attr('href');
      $(tab).fadeIn(200);
      return false;
    });
  });

}).call(this);
