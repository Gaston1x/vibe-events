IF DB_ID(N'VibeEvents') IS NULL
BEGIN
  CREATE DATABASE VibeEvents;
END
GO

USE VibeEvents;
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Users (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Users_id DEFAULT NEWID(),
    name NVARCHAR(80) NOT NULL,
    email NVARCHAR(120) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(30) NOT NULL CONSTRAINT DF_Users_role DEFAULT N'client',
    is_active BIT NOT NULL CONSTRAINT DF_Users_is_active DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_Users_created_at DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_Users_updated_at DEFAULT SYSUTCDATETIME(),
    last_login_at DATETIME2 NULL,
    CONSTRAINT PK_Users PRIMARY KEY (id),
    CONSTRAINT UQ_Users_email UNIQUE (email)
  );
END
GO

IF OBJECT_ID(N'dbo.UserAuditLog', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.UserAuditLog (
    id BIGINT IDENTITY(1,1) NOT NULL,
    user_id UNIQUEIDENTIFIER NULL,
    action NVARCHAR(60) NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_UserAuditLog_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_UserAuditLog PRIMARY KEY (id),
    CONSTRAINT FK_UserAuditLog_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(id)
  );
END
GO

-- Consentimientos (registro, mayoría de edad y correos promocionales).
-- Usa ALTER para que también se actualicen las bases creadas con la versión anterior.
IF COL_LENGTH(N'dbo.Users', N'terms_version') IS NULL
  ALTER TABLE dbo.Users ADD terms_version NVARCHAR(20) NULL;
GO

IF COL_LENGTH(N'dbo.Users', N'accepted_terms_at') IS NULL
  ALTER TABLE dbo.Users ADD accepted_terms_at DATETIME2 NULL;
GO

IF COL_LENGTH(N'dbo.Users', N'is_adult_confirmed') IS NULL
  ALTER TABLE dbo.Users ADD is_adult_confirmed BIT NOT NULL CONSTRAINT DF_Users_is_adult_confirmed DEFAULT 0;
GO

IF COL_LENGTH(N'dbo.Users', N'marketing_opt_in') IS NULL
  ALTER TABLE dbo.Users ADD marketing_opt_in BIT NOT NULL CONSTRAINT DF_Users_marketing_opt_in DEFAULT 0;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Users_email_active' AND object_id = OBJECT_ID(N'dbo.Users'))
BEGIN
  CREATE INDEX IX_Users_email_active ON dbo.Users(email, is_active);
END
GO
