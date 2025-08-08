import aj from '../config/arcjetConfig.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1});

        //console.log('🔍 Arcjet Decision:', {
        //    isDenied: decision.isDenied(),
        //    reason: decision.reason,
        //    ruleResults: decision.results
        //});

        if(decision.isDenied()) {
            console.log('🚫 Arcjet denied request:', decision.reason);
            
            if(decision.reason.isRateLimit()) {
                //console.log('⏰ Rate limit hit!', decision.reason);
                return res.status(429).json({
                    success: false,
                    message: "Rate limit exceeded. Please try again later."
                });
            }
            
            if(decision.reason.isBot()) {
               // console.log('🤖 Bot detected:', decision.reason);
                return res.status(403).json({
                    success: false,
                    message: "Bot requests are not allowed."
                });
            }
            
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        //console.log('✅ Arcjet allowed request');
        next();

    } catch (error) {
        console.error("Arcjet Middleware Error:", error);
        // In development, don't block on Arcjet errors
        if (process.env.NODE_ENV === 'development') {
            console.log('⚠️ Arcjet error ignored in development');
            return next();
        }
        next(error);
    }
} 

export default arcjetMiddleware;