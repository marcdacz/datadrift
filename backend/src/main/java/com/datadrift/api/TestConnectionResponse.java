package com.datadrift.api;

/** Response for POST /api/data-sources/test. MVP validates config only; no real connectivity. */
public record TestConnectionResponse(boolean success, String message) {}
