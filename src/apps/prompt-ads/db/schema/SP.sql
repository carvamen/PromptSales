
-- Conectar a la base promptads
USE promptads;
GO

-- SP de Escritura
CREATE OR ALTER PROCEDURE usp_Campaign_Create
    @IdOrganization INT,
    @Name VARCHAR(60),
    @Description VARCHAR(200),
    @IdCity INT,
    @StartsAt DATE,
    @EndsAt DATE,
    @IdCampaignStatus TINYINT = 1
AS
BEGIN
    INSERT INTO PACampaigns (
        IdOrganization, name, description, IdCity, 
        createdAt, startsAt, endsAt, IdCampaignStatus, deleted
    )
    VALUES (
        @IdOrganization, @Name, @Description, @IdCity,
        GETDATE(), @StartsAt, @EndsAt, @IdCampaignStatus, 0
    );
    
    SELECT SCOPE_IDENTITY() as NewCampaignId;
END
GO

-- SP de Lectura
CREATE OR ALTER PROCEDURE usp_Campaign_GetById
    @CampaignId INT
AS
BEGIN
    SELECT 
        c.IdCampaign, c.name, c.description, c.IdCity,
        c.createdAt, c.startsAt, c.endsAt, c.IdCampaignStatus,
        o.name as OrganizationName
    FROM PACampaigns c
    INNER JOIN PAOrganizations o ON c.IdOrganization = o.IdOrganization
    WHERE c.IdCampaign = @CampaignId AND c.deleted = 0;
END
GO
