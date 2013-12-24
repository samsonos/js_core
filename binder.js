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
            // Bind click event
            clickable.click(function()
            {
				var beforeHandlerStatus = true;
                // If external response handler is passed
                if( beforeHandler ) beforeHandlerStatus = beforeHandler( response );

                // If external response handler return true status
				if (beforeHandlerStatus) {
					// Perform async request
					s.ajax(clickable.a('href'),function(response)
					{
						try
						{
							// Parse server response
							response = JSON.parse(response);

							// If external response handler is passed
							if( responseHandler ) responseHandler( response );
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
                if( beforeHandler ) beforeHandlerStatus = beforeHandler( response );

                // If external response handler return true status
				if (beforeHandlerStatus) {
					form.ajaxForm(function(response)
					{
						try
						{
							// Parse server response
							response = JSON.parse(response);

							// If external response handler is passed
							if( responseHandler ) responseHandler( response );
						}
						catch(e){}
					});
				}
            }, true, true );
        });
    }
}

// Add plugin to SamsonJS
SamsonJS.extend( SJSBinder );