package com.roima.learn.application.config.security;

import com.roima.learn.application.model.User;
import com.roima.learn.application.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

@Component("userSecurity")
public class UserSecurity  implements AuthorizationManager<RequestAuthorizationContext> {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Override
    public AuthorizationDecision check(Supplier authenticationSupplier, RequestAuthorizationContext ctx) {
        // get {userId} from the request
//        System.out.println("ctx variables:::::"+ctx.getVariables());
        int userId = 0;
        Authentication authentication = (Authentication) authenticationSupplier.get();

        if (ctx.getVariables().get("userId") != null) {
            userId = Integer.parseInt(ctx.getVariables().get("userId"));
        }
        if (ctx.getVariables().get("studentId") != null) {
            userId = Integer.parseInt(ctx.getVariables().get("studentId"));
        }
//        if (ctx.getVariables().get("examId") != null) {
//            System.out.println("token ::::::::: "+authentication.getCredentials());
//            return new AuthorizationDecision(true);
//        }

//        System.out.println("userid  "+userId);
//        System.out.println("token ::::::::: "+authentication.getCredentials());
        return new AuthorizationDecision(hasUserId(authentication, userId));
    }

    public boolean hasUserId(Authentication authentication, int userId) {

        try {

            User user = (User) authentication.getPrincipal();
            return (user.getId() == userId && user.getRole().getType().equals("ROLE_USER")) || user.getRole().getType().equals("ROLE_ADMIN");

        }
        catch (Exception e) {
            return false;
        }

//        && role.contains("ROLE_USER")) || role.contains("ROLE_ADMIN")
    }
}

