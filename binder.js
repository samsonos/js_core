/**
 * Created by Vitaly Egorov <egorov@samsonos.com> on 04.12.13.
 */
/** Universal function for async request & responses */
var SJSBinder = {
    /**
     *
     * @returns {SamsonJS}
     */
    ajaxClick : function( responseHandler, beforeHandler )
    {
        // Iterate all elements
        return this.each(function(clickable)
        {
            var busy = false;
            // Bind click event
            clickable.click(function()
            {
                if (!busy) {
                    var beforeHandlerStatus = true;
                    // If external response handler is passed
                    if( beforeHandler ) beforeHandlerStatus = beforeHandler(clickable);

                    // If external response handler return true status
                    if (beforeHandlerStatus) {
                        busy = true;
                        // Perform async request
                        s.ajax(clickable.a('href'),function(response)
                        {
                            busy = false;
                            try
                            {
                                // Parse JSON only if this is not an object
                                if (typeof(serverResponse) !== "object") {
                                    // Parse JSON response
                                    serverResponse = JSON.parse(serverResponse);
                                }

                                // If external response handler is passed
                                if( responseHandler ) responseHandler( response, clickable );
                            }
                            catch(e){}
                        });
                    }
                }
            }, true, true );
        });
    },

    /**
     *  Send AJAX request to the url placed in option value when this option is selected
     * @returns {SamsonJS}
     */
    ajaxSelect : function( responseHandler, beforeHandler )
    {
        // Iterate all elements
        return this.each(function(clickable)
        {
            // Bind click event
            clickable.change(function(clickable, options, event, selected)
            {
                var beforeHandlerStatus = true;
                // If external response handler is passed
                if( beforeHandler ) beforeHandlerStatus = beforeHandler(clickable);

                // If external response handler return true status
                if (beforeHandlerStatus) {
                    // Perform async request
                    s.ajax(selected.val(),function(response)
                    {
                        try
                        {
                            // Parse JSON only if this is not an object
                            if (typeof(serverResponse) !== "object") {
                                // Parse JSON response
                                serverResponse = JSON.parse(serverResponse);
                            }

                            // If external response handler is passed
                            if( responseHandler ) responseHandler( response, clickable );
                        }
                        catch(e){}
                    });
                }
            }, true, true );
        });
    },
    
    /**
     *
     * @param responseHandler
     */
    ajaxSubmit : function( responseHandler, beforeHandler )
    {
        // Iterate all elements
        return this.each(function(form)
        {
            form.submit(function()
            {			
				var beforeHandlerStatus = true;
                // If external response handler is passed
                if( beforeHandler ) beforeHandlerStatus = beforeHandler(form);

                // If external response handler return true status
				if (beforeHandlerStatus) {
					form.ajaxForm(function(response)
					{
						try
						{
                            // Parse JSON only if this is not an object
                            if (typeof(serverResponse) !== "object") {
                                // Parse JSON response
                                serverResponse = JSON.parse(serverResponse);
                            }

							// If external response handler is passed
							if( responseHandler ) responseHandler( response, form);
						}
						catch(e){s.trace(e.toString())}
					});
				}
            }, true, true );
        });
    }
}

// Add plugin to SamsonJS
SamsonJS.extend( SJSBinder );
