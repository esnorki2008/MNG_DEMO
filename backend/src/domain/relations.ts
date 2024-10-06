import Attachment from "./entities/attachment";
import Issue from "./entities/issue";
import Project from "./entities/project";
import User from "./entities/user";
import UserProject from "./entities/user-project";

export default function defineRelations() {
  Attachment.belongsTo(Issue, {
    foreignKey: "issueId",
    as: "issue",
  });

  Project.hasMany(Issue, {
    foreignKey: "projectId",
    as: "issues",
  });

  // un issue puede tener varios hijos, y un padre puede tener varios hijos
  Issue.hasMany(Issue, {
    foreignKey: "parentIssueId",
    as: "subIssues",
  });

  Issue.belongsTo(Issue, {
    foreignKey: "parentIssueId",
    as: "parentIssue",
  });

  // un issue puede depender de otro issue
  Issue.belongsTo(Issue, {
    foreignKey: "dependsOnIssueId",
    as: "dependsOn",
  });

  Issue.hasMany(Issue, {
    foreignKey: "dependsOnIssueId",
    as: "dependentIssues",
  });

  Issue.belongsTo(Project, {
    foreignKey: "projectId",
    as: "project",
  });

  Issue.hasMany(Attachment, {
    foreignKey: "issueId",
    as: "attachments",
  });

  User.belongsToMany(Project, { through: UserProject });
  Project.belongsToMany(User, { through: UserProject });
}
