package com.kursea.nbaplayerstats;

import org.apache.cordova.DroidGap;

import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnKeyListener;

public class PhoneGapNbaPlayerStatsActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	try {
    		
    		/*
    		try {
    		if (Build.VERSION.SDK_INT >= VERSION_CODES.JELLY_BEAN) //16
        		// yourwebview, i use phonegap here
        		super.appView.getSettings().setAllowUniversalAccessFromFileURLs(true);
    		}
    		catch (NullPointerException ex) {
    			Log.d("PhoneGapTestNbaPlayersActivity", ex.toString());
    		}
    		*/
    		
        	super.onCreate(savedInstanceState);
        	
        	Log.d("PhoneGapTestNbaPlayersActivity", "Antes de direccionar a index.html");
        	super.loadUrl("file:///android_asset/www/nbaplayers/index.html");
        	Log.d("PhoneGapTestNbaPlayersActivity", "Después de direccionar a index.html");
        }
        catch (Exception ex) {
        	Log.d("PhoneGapTestNbaPlayersActivity", ex.toString());
        	Log.e("PhoneGapTestNbaPlayersActivity", ex.toString());
        }
    }
    
    @Override
    public void onBackPressed(){ 
    	
    	
    }
}