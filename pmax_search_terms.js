// Copyright 2023
// Free to use or alter for everyone. A mention would be nice ;-)
//
// Idea By: Mike Rhodes
// Put on steroids by: Tibbe van Asten
// 
// Created: 15-08-2023
// Last update: 18-08-2023: fixed a little mistake in the query, that prevents you from collecting more than 30 days data
//
// ABOUT THE SCRIPT
// Export search term from Pmax campaigns to a spreadsheet.
//
////////////////////////////////////////////////////////////////////

var config = {

    LOG : true,

    // Change the number of days of which data must be exported. Only change the number!
    DATE_RANGE: last_n_days(360),
    
    // Edit the URL of an empty Google Sheet in here, with '/edit' at the end
    SPREADSHEET_URL : ""
  
  }  
    
  ////////////////////////////////////////////////////////////////////
  
  function main() {
    
      var spreadsheet = SpreadsheetApp.openByUrl(config.SPREADSHEET_URL);
    
    let campaignIterator = AdsApp
      .performanceMaxCampaigns()
      .withCondition("campaign.status = PAUSED")
      .get();
    
    while(campaignIterator.hasNext()){
      let campaign = campaignIterator.next();
      
      let query = AdsApp.report(
        "SELECT campaign_search_term_insight.category_label, metrics.clicks, metrics.impressions, metrics.conversions, metrics.conversions_value " +
        "FROM campaign_search_term_insight " +
        "WHERE campaign_search_term_insight.campaign_id = '" + campaign.getId() + "' " +
        "AND segments.date BETWEEN '" + config.DATE_RANGE.split(',')[0] + "' AND '" + config.DATE_RANGE.split(',')[1] + "' " +
        "ORDER BY metrics.impressions DESC"
      );
      
        if(config.LOG === true){
           Logger.log("Report " + campaign.getName() + " contains " + query.rows().totalNumEntities() + " rows.");
        }
      
      let sheet = checkTab(spreadsheet, campaign.getName());
      query.exportToSheet(sheet);
    } // campaignIterator    
    
  }
    
  ////////////////////////////////////////////////////////////////////
  
  function checkTab(file, tabName){
    
    if(SpreadsheetApp.openById(file.getId()).getSheetByName(tabName)){
      var tab = SpreadsheetApp.openById(file.getId()).getSheetByName(tabName);
      
      if(config.LOG === true){
       Logger.log("Selected tab " + tabName);      
      }
    } else {
      var tab = SpreadsheetApp.openById(file.getId()).insertSheet(tabName);
      
        if(config.LOG === true){
         Logger.log("Created tab " + tabName);      
        }
    }
    
    // Remove default tab in Dutch
    if(SpreadsheetApp.openById(file.getId()).getSheetByName("Blad1")){
      var defaultSheet = SpreadsheetApp.openById(file.getId()).getSheetByName("Blad1")
      SpreadsheetApp.openById(file.getId()).deleteSheet(defaultSheet);
    }
    
    // Remove default tab in English
    if(SpreadsheetApp.openById(file.getId()).getSheetByName("Sheet1")){
      var defaultSheet = SpreadsheetApp.openById(file.getId()).getSheetByName("Sheet1")
      SpreadsheetApp.openById(file.getId()).deleteSheet(defaultSheet);
    }
    
    return tab;
    
  } // function checkTab
  
  ////////////////////////////////////////////////////////////////////
  
  function last_n_days(n) {
  
      var	from = new Date(), to = new Date();
      to.setUTCDate(from.getUTCDate() - n);
    from.setUTCDate(from.getUTCDate() - 1);
  
      return google_date_range(from, to);
  
  } // function last_n_days()
  
  ////////////////////////////////////////////////////////////////////
  
  function google_date_range(from, to) {
  
      function google_format(date) {
          var date_array = [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
          if (date_array[1] < 10) date_array[1] = '0' + date_array[1];
          if (date_array[2] < 10) date_array[2] = '0' + date_array[2];
  
          return date_array.join('');
      }
  
      var inverse = (from > to);
      from = google_format(from);
      to = google_format(to);
      var result = [from, to];
  
      if (inverse) {
          result = [to, from];
      }
  
      return result.join(',');
  
  } // function google_date_range()
