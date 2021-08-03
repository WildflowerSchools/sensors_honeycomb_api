exports.typeDefs = `

  type Environment @beehiveTable(table_name: "environments", pk_column: "environment_id") {
    environment_id: ID!
    name: String!,
    transparent_classroom_id: Int
    description: String
    location: String
    assignments: [Assignment!] @beehiveAssignmentFilter(target_type_name: "Assignment", assignee_field: "environment")
    layouts: [Layout!] @beehiveAssignmentFilter(target_type_name: "Layout", assignee_field: "environment")
  }

  type EnvironmentList {
    data: [Environment!]!
    page_info: PageInfo!
  }

  input EnvironmentInput {
    name: String!
    transparent_classroom_id: Int
    description: String
    location: String
  }

  input EnvironmentUpdateInput {
    name: String
    transparent_classroom_id: Int
    description: String
    location: String
  }

  type Person @beehiveTable(table_name: "persons", pk_column: "person_id") {
    person_id: ID!
    name: String
    first_name: String
    last_name: String
    nickname: String
    short_name: String
    anonymized_name: String
    anonymized_first_name: String
    anonymized_last_name: String
    anonymized_nickname: String
    anonymized_short_name: String
    person_type: PersonType
    transparent_classroom_id: Int
    # Environment assignments associated with this device
    assignments: [Assignment!] @beehiveAssignmentFilter(target_type_name: "Assignment", assignee_field: "assigned")
    # Position assignments associated with this device
    position_assignments: [PositionAssignment!] @beehiveAssignmentFilter(target_type_name: "PositionAssignment", assignee_field: "assigned")
    # Entity assignments associated with this person
    entity_assignments: [EntityAssignment!] @beehiveAssignmentFilter(target_type_name: "EntityAssignment", assignee_field: "entity")
    # Material interactions associated with this person
    material_interactions: [MaterialInteraction!] @beehiveRelationFilter(target_type_name: "MaterialInteraction", target_field_name: "person")
    # Tray interactions associated with this person
    tray_interactions: [TrayInteraction!] @beehiveRelationFilter(target_type_name: "TrayInteraction", target_field_name: "person")
    # 3D poses associated with this person
    poses3d: [Pose3D!] @beehiveRelationFilter(target_type_name: "Pose3D", target_field_name: "person")
    # 2D poses associated with this person
    poses2d: [Pose2D!] @beehiveRelationFilter(target_type_name: "Pose2D", target_field_name: "person")
  }

  type PersonList {
    data: [Person!]!
    page_info: PageInfo!
  }

  enum PersonType {
    STUDENT
    TEACHER
    ASSISTANT
    PARENT
    OTHER
  }

  enum AssignableTypeEnum {
    PERSON
    DEVICE
    MATERIAL
    TRAY
  }

  type Layout @beehiveAssignmentType(table_name: "layouts", assigned_field: "environment", exclusive: true, pk_column: "layout_id") {
      layout_id: ID!
      environment: Environment! @beehiveRelation(target_type_name: "Environment")
      spaces: [Rect!]
      objects: [Rect!]
      start: Datetime
      end: Datetime
  }

  type Rect {
      name: String
      x: Int!
      y: Int!
      width: Int!
      height: Int!
  }

  input RectInput {
      name: String
      x: Int!
      y: Int!
      width: Int!
      height: Int!
  }

  input LayoutInput {
      environment: ID!
      spaces: [RectInput!]
      objects: [RectInput!]
      start: Datetime
      end: Datetime
  }

  union Assignable @beehiveUnion = Device | Person | Material | Tray

  type Assignment @beehiveAssignmentType(table_name: "assignments", assigned_field: "assigned", assignee_field: "environment", exclusive: true, pk_column: "assignment_id") {
    assignment_id: ID!
    environment: Environment! @beehiveRelation(target_type_name: "Environment")
    assigned: Assignable! @beehiveUnionResolver(target_types: ["Device", "Person", "Material", "Tray"])
    assigned_type: AssignableTypeEnum!
    start: Datetime!
    end: Datetime
    data: [Datapoint!] @beehiveRelationFilter(target_type_name: "Datapoint", target_field_name: "source")
  }

  type AssignmentList {
    data: [Assignment!]!
    page_info: PageInfo!
  }

  input AssignmentInput {
    environment: ID!
    assigned_type: AssignableTypeEnum!
    assigned: ID!
    start: Datetime
    end: Datetime
  }

  input AssignmentUpdateInput {
    environment: ID
    assigned_type: AssignableTypeEnum
    assigned: ID
    start: Datetime
    end: Datetime
  }

  input PersonInput {
    name: String
    first_name: String
    last_name: String
    nickname: String
    short_name: String
    anonymized_name: String
    anonymized_first_name: String
    anonymized_last_name: String
    anonymized_nickname: String
    anonymized_short_name: String
    person_type: PersonType
    transparent_classroom_id: Int
  }

  input PersonUpdateInput {
    name: String
    first_name: String
    last_name: String
    nickname: String
    short_name: String
    anonymized_name: String
    anonymized_first_name: String
    anonymized_last_name: String
    anonymized_nickname: String
    anonymized_short_name: String
    person_type: PersonType
    transparent_classroom_id: Int
  }

  type EntityAssignment @beehiveAssignmentType(table_name: "entityassignments", assigned_field: "device", assignee_field: "entity", exclusive: true, pk_column: "entity_assignment_id") {
    entity_assignment_id: ID!
    entity_type: EntityType!
    entity: Entity! @beehiveUnionResolver(target_types: ["Person", "Material", "Tray"])
    device: Device! @beehiveRelation(target_type_name: "Device")
    start: Datetime!
    end: Datetime
  }

  type EntityAssignmentList {
    data: [EntityAssignment!]!
    page_info: PageInfo!
  }

  input EntityAssignmentInput {
    entity_type: EntityType!
    entity: ID!
    device: ID!
    start: Datetime!
    end: Datetime
  }

  input EntityAssignmentUpdateInput {
    entity_type: EntityType
    entity: ID
    device: ID
    start: Datetime
    end: Datetime
  }

  union Entity @beehiveUnion = Person | Material | Tray

  enum EntityType {
    PERSON
    MATERIAL
    TRAY
  }

  type MaterialAssignment @beehiveAssignmentType(table_name: "materialassignments", assigned_field: "tray", assignee_field: "material", exclusive: true, pk_column: "material_assignment_id") {
    material_assignment_id: ID!
    material: Material! @beehiveRelation(target_type_name: "Material")
    tray: Tray! @beehiveRelation(target_type_name: "Tray")
    start: Datetime!
    end: Datetime
  }

  type MaterialAssignmentList {
    data: [MaterialAssignment!]!
    page_info: PageInfo!
  }

  input MaterialAssignmentInput {
    material: ID!
    tray: ID!
    start: Datetime!
    end: Datetime
  }

  input MaterialAssignmentUpdateInput {
    material: ID
    tray: ID
    start: Datetime
    end: Datetime
  }

  extend type Query {
    # Get the list of environments
    environments(page: PaginationInput): EnvironmentList @beehiveList(target_type_name: "Environment")
    # Get an environment
    getEnvironment(environment_id: ID!): Environment @beehiveGet(target_type_name: "Environment")
    # Find environments based on one or more of their properties
    findEnvironments(name: String, transparent_classroom_id: Int, location: String, page: PaginationInput): EnvironmentList @beehiveSimpleQuery(target_type_name: "Environment")
    # Find environments based on one or more of their properties (DEPRECATED, use findEnvironments instead)
    findEnvironment(name: String, location: String): EnvironmentList @beehiveSimpleQuery(target_type_name: "Environment")
    # Find environments using a complex query
    searchEnvironments(query: QueryExpression!, page: PaginationInput): EnvironmentList @beehiveQuery(target_type_name: "Environment")

    # Get the list of environment assignments
    assignments(page: PaginationInput): AssignmentList @beehiveList(target_type_name: "Assignment")
    # Get an environment assignment
    getAssignment(assignment_id: ID!): Assignment @beehiveGet(target_type_name: "Assignment")
    # Find environment assignments based on one or more of their properties
    findAssignments(assignment_id: ID, environment: ID, assigned: ID, assigned_type: AssignableTypeEnum, page: PaginationInput): AssignmentList @beehiveSimpleQuery(target_type_name: "Assignment")
    # Find environment assignments using a complex query
    searchAssignments(query: QueryExpression!, page: PaginationInput): AssignmentList @beehiveQuery(target_type_name: "Assignment")

    # Get the list of people
    persons(page: PaginationInput): PersonList @beehiveList(target_type_name: "Person")
    # Get a person
    getPerson(person_id: ID!): Person @beehiveGet(target_type_name: "Person")
    # Find people based on one or more of their properties
    findPersons(name: String, first_name: String, last_name: String, nickname: String, short_name: String, anonymized_first_name: String, anonymized_last_name: String, anonymized_nickname: String, anonymized_short_name: String, person_type: PersonType, transparent_classroom_id: Int, page: PaginationInput): PersonList @beehiveSimpleQuery(target_type_name: "Person")
    # Find people using a complex query
    searchPersons(query: QueryExpression!, page: PaginationInput): PersonList @beehiveQuery(target_type_name: "Person")

    # Get the list of entity assignments
    entityAssignments(page: PaginationInput): EntityAssignmentList @beehiveList(target_type_name: "EntityAssignment")
    # Get an entity assignment
    getEntityAssignment(entity_assignment_id: ID!): EntityAssignment @beehiveGet(target_type_name: "EntityAssignment")
    # Find entity assignments based on one or more of their properties
    findEntityAssignments(entity_type: EntityType, entity: ID, device: ID, page: PaginationInput): EntityAssignmentList @beehiveSimpleQuery(target_type_name: "EntityAssignment")
    # Find entity assignments using a complex query
    searchEntityAssignments(query: QueryExpression!, page: PaginationInput): EntityAssignmentList @beehiveQuery(target_type_name: "EntityAssignment")

    # Get the list of material assignments
    materialAssignments(page: PaginationInput): MaterialAssignmentList @beehiveList(target_type_name: "MaterialAssignment")
    # Get a material assignment
    getMaterialAssignment(material_assignment_id: ID!): MaterialAssignment @beehiveGet(target_type_name: "MaterialAssignment")
    # Find material assignments based on one or more of their properties
    findMaterialAssignments(material: ID, tray: ID, page: PaginationInput): MaterialAssignmentList @beehiveSimpleQuery(target_type_name: "MaterialAssignment")
    # Find material assignments using a complex query
    searchMaterialAssignments(query: QueryExpression!, page: PaginationInput): MaterialAssignmentList @beehiveQuery(target_type_name: "MaterialAssignment")

  }

  extend type Mutation {
    # Create a new environment
    createEnvironment(environment: EnvironmentInput): Environment @beehiveCreate(target_type_name: "Environment")
    # Update a person
    updateEnvironment(environment_id: ID!, environment: EnvironmentUpdateInput): Environment @beehiveUpdate(target_type_name: "Environment")
    # Delete an environment
    deleteEnvironment(environment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Environment")

    # Assign an assignable to an environment
    assignToEnvironment(assignment: AssignmentInput): Assignment @beehiveCreate(target_type_name: "Assignment")
    # Update an environment assignment
    updateAssignment(assignment_id: ID!, assignment: AssignmentUpdateInput): Assignment @beehiveUpdate(target_type_name: "Assignment")
    # Delete an environment assignment
    deleteAssignment(assignment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Assignment")


    # creates a new Layout, which represents the basic shape of an enviroment.
    createLayout(layout: LayoutInput): Layout @beehiveCreate(target_type_name: "Layout")
    # set the end date for a Layout
    updateLayout(layout_id: ID!, layout: AssignmentUpdateInput): Layout @beehiveUpdate(target_type_name: "Layout")

    # Create a new person
    createPerson(person: PersonInput): Person @beehiveCreate(target_type_name: "Person")
    # Update a person
    updatePerson(person_id: ID!, person: PersonUpdateInput): Person @beehiveUpdate(target_type_name: "Person")
    # Delete a person
    deletePerson(person_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "Person")

    # Assign device to entity
    assignToEntity(entityAssignment: EntityAssignmentInput): EntityAssignment @beehiveCreate(target_type_name: "EntityAssignment")
    # Update an entity assignment
    updateEntityAssignment(entity_assignment_id: ID!, entityAssignment: EntityAssignmentUpdateInput): EntityAssignment @beehiveUpdate(target_type_name: "EntityAssignment")
    # Delete an entity assignment
    deleteEntityAssignment(entity_assignment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "EntityAssignment")

    # Assign tray to material
    assignToMaterial(materialAssignment: MaterialAssignmentInput): MaterialAssignment @beehiveCreate(target_type_name: "MaterialAssignment")
    # Update a material assignment
    updateMaterialAssignment(material_assignment_id: ID!, materialAssignment: MaterialAssignmentUpdateInput): MaterialAssignment @beehiveUpdate(target_type_name: "MaterialAssignment")
    # Delete a material assignment
    deleteMaterialAssignment(material_assignment_id: ID): DeleteStatusResponse @beehiveDelete(target_type_name: "MaterialAssignment")

  }

`
