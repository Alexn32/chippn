-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE chore_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own profile, public profiles (display_name, email)
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Households: Users can read households they're a member of
CREATE POLICY "Users can read households they're in"
  ON households FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_members.household_id = households.id
        AND household_members.user_id = auth.uid()
    )
  );

-- Household members: Users can read members of households they're in
CREATE POLICY "Users can read household members"
  ON household_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members AS hm
      WHERE hm.household_id = household_members.household_id
        AND hm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join households"
  ON household_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Chores: Users can read chores from households they're in
CREATE POLICY "Users can read chores in their households"
  ON chores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_members.household_id = chores.household_id
        AND household_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chores in their households"
  ON chores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_members.household_id = chores.household_id
        AND household_members.user_id = auth.uid()
    )
  );

-- Chore assignments: Users can read their own assignments
CREATE POLICY "Users can read their assignments"
  ON chore_assignments FOR SELECT
  USING (assigned_to = auth.uid());

CREATE POLICY "Household members can see all assignments"
  ON chore_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chores
      INNER JOIN household_members ON household_members.household_id = chores.household_id
      WHERE chores.id = chore_assignments.chore_id
        AND household_members.user_id = auth.uid()
    )
  );

-- Chat messages: Users can read messages from households they're in
CREATE POLICY "Users can read messages in their households"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_members.household_id = chat_messages.household_id
        AND household_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their households"
  ON chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_members.household_id = chat_messages.household_id
        AND household_members.user_id = auth.uid()
    )
  );

-- Notification tokens: Users manage their own tokens
CREATE POLICY "Users can manage their notification tokens"
  ON notification_tokens FOR ALL
  USING (user_id = auth.uid());
