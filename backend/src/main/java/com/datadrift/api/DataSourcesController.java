package com.datadrift.api;

import com.datadrift.domain.DataSource;
import com.datadrift.service.DataSourceService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for data sources (configuration only, no execution). Sensitive config values are
 * encrypted at rest and masked on read.
 */
@RestController
@RequestMapping("/api/data-sources")
public class DataSourcesController {

    private final DataSourceService dataSourceService;

    public DataSourcesController(final DataSourceService dataSourceService) {
        this.dataSourceService = dataSourceService;
    }

    @PostMapping
    public ResponseEntity<DataSourceResponse> create(
            @Valid @RequestBody final CreateDataSourceRequest request) {
        final DataSource created =
                dataSourceService.create(request.name(), request.type(), request.config());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(created));
    }

    @GetMapping
    public ResponseEntity<List<DataSourceResponse>> list() {
        final List<DataSourceResponse> list =
                dataSourceService.findAll().stream().map(this::toResponse).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataSourceResponse> getById(@PathVariable final UUID id) {
        final DataSource entity = dataSourceService.getById(id);
        return ResponseEntity.ok(toResponse(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DataSourceResponse> update(
            @PathVariable final UUID id,
            @Valid @RequestBody final CreateDataSourceRequest request) {
        final DataSource updated =
                dataSourceService.update(id, request.name(), request.type(), request.config());
        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable final UUID id) {
        dataSourceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/test")
    public ResponseEntity<TestConnectionResponse> testConnection(
            @Valid @RequestBody final CreateDataSourceRequest request) {
        dataSourceService.validateConfigForTest(request.config());
        return ResponseEntity.ok(new TestConnectionResponse(true, "Connection validated."));
    }

    @PostMapping("/{id}/test")
    public ResponseEntity<TestConnectionResponse> testConnectionById(@PathVariable final UUID id) {
        dataSourceService.validateConfigForTestById(id);
        return ResponseEntity.ok(new TestConnectionResponse(true, "Connection validated."));
    }

    private DataSourceResponse toResponse(final DataSource entity) {
        final String maskedConfig = dataSourceService.maskConfigForApi(entity.getConfig());
        return new DataSourceResponse(
                entity.getId(),
                entity.getName(),
                entity.getType(),
                maskedConfig,
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
