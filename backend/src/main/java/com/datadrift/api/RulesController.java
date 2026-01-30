package com.datadrift.api;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Placeholder for future implementation. */
@RestController
@RequestMapping("/api/rules")
public class RulesController {

    @GetMapping
    public ResponseEntity<Map<String, String>> list() {
        return ResponseEntity.ok(Map.of("message", "Not implemented yet"));
    }
}
